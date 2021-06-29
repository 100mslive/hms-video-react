import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { getLocalStream, validateDeviceAV } from '@100mslive/hms-video';
import { HMSPeer } from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { MessageModal } from '../MessageModal';
import { SettingsFormProps } from '../Settings/Settings';
import { Button } from '../Button';
import { ProgressIcon } from '../Icons';
import { VideoTile, VideoTileProps } from '../VideoTile';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { PreviewControls } from './Controls';
import { Input } from '../Input';
import { closeMediaStream } from '../../utils';
import { hmsUiClassParserGenerator } from '../../utils/classes';

interface JoinInfo {
  audioMuted?: boolean;
  videoMuted?: boolean;
  name?: string;
}
export interface PreviewClasses {
  root?: string;
  containerRoot?: string;
  header?: string;
  messageModal?: string;
  helloDiv?: string;
  nameDiv?: string;
  inputRoot?: string;
  joinButton?: string;
  goBackButton?: string;
}
const defaultClasses: PreviewClasses = {
  root:
    'flex h-full w-screen bg-white dark:bg-black justify-center items-center',
  containerRoot:
    'flex flex-col justify-center items-center w-37.5 h-full md:h-400 pb-4 box-border bg-gray-700 dark:bg-gray-100 text-gray-100 dark:text-white overflow-hidden md:rounded-2xl',
  header: 'w-4/5 h-2/5 md:w-22.5 md:h-22.5 mt-1.875 mb-7',
  helloDiv: 'text-2xl font-medium mb-2',
  nameDiv: 'text-lg leading-6 mb-2',
  inputRoot: 'p-2 mb-3',
};
export interface PreviewProps {
  joinOnClick: ({ audioMuted, videoMuted, name }: JoinInfo) => void;
  onChange: (values: SettingsFormProps) => void;
  /**
   * Click handler for error modal close.
   * Ignored when either of the allowWithError properties is true.
   */
  errorOnClick: () => void;
  allowWithError?: {
    capture: boolean;
    unsupported: boolean;
  };
  videoTileProps?: Partial<VideoTileProps>;
  videoTileClasses?: VideoTileClasses;
  /**
   * extra classes added  by user
   */
  classes?: PreviewClasses;
}

export const Preview = ({
  joinOnClick,
  errorOnClick,
  onChange,
  allowWithError = {
    capture: true,
    unsupported: true,
  },
  videoTileProps,
  classes,
  videoTileClasses,
}: PreviewProps) => {
  const { tw } = useHMSTheme();

  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<PreviewClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-preview',
      }),
    [],
  );

  const [mediaStream, setMediaStream] = useState<MediaStream>();
  /** This is to show error message only when input it touched or button is clicked */
  const [showValidation, setShowValidation] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState({
    allowJoin: false,
    title: '',
    message: '',
  });
  const [audioMuted, setAudioMuted] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);
  const [selectedAudioInput, setSelectedAudioInput] = useState('default');
  const [selectedVideoInput, setSelectedVideoInput] = useState('default');
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const streamIdRef = useRef<string | undefined>();

  const getMediaEnabled = useCallback(
    (type: string) => {
      const track =
        type === 'video'
          ? mediaStream?.getVideoTracks()[0]
          : mediaStream?.getAudioTracks()[0];
      return Boolean(track?.enabled);
    },
    [mediaStream],
  );

  const toggleMediaState = (type: string) => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (type === 'audio' && audioTrack) {
        audioTrack.enabled = !getMediaEnabled('audio');
        setAudioMuted(!audioTrack.enabled);
      } else if (type === 'video' && videoTrack) {
        videoTrack.enabled = !getMediaEnabled('video');
        setVideoMuted(!videoTrack.enabled);
      }
    }
  };

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(Boolean(error.title));
  }, [error.title]);

  const startMediaStream = useCallback(async () => {
    alert(JSON.stringify({ olderstream: mediaStream }));
    if (streamIdRef.current === mediaStream?.id) {
      return;
    }
    closeMediaStream(mediaStream);

    try {
      await validateDeviceAV();
      const constraints = {
        audio:
          !audioMuted && selectedAudioInput
            ? { deviceId: selectedAudioInput }
            : true,
        video:
          !videoMuted && selectedVideoInput
            ? { deviceId: selectedVideoInput }
            : true,
      };
      const stream = await getLocalStream(constraints);
      streamIdRef.current = stream.id;
      setMediaStream(stream);
    } catch (error) {
      if (error.code !== 3003) {
        setError({
          allowJoin: allowWithError.capture,
          title: error.description || 'Unable to Access Camera/Microphone',
          message: error.message,
        });
      }
      alert(JSON.stringify({ error, mediaStream }));
      closeMediaStream(mediaStream);

      // Start stream if any one is available
      const audioFailure = error.message.includes('audio');
      const videoFailure = error.message.includes('video');
      if (!(audioFailure && videoFailure)) {
        const stream = await getLocalStream({
          audio: !audioFailure && { deviceId: selectedAudioInput },
          video: !videoFailure && { deviceId: selectedVideoInput },
        });

        streamIdRef.current = stream.id;
        setMediaStream(stream);
      }
    }
  }, [mediaStream?.id]);

  useEffect(() => {
    // Init mute values
    setAudioMuted(!getMediaEnabled('audio'));
    setVideoMuted(!getMediaEnabled('video'));
  }, [mediaStream]);

  window.onunload = () => closeMediaStream(mediaStream);

  useEffect(() => {
    startMediaStream();
    return () => {
      closeMediaStream(mediaStream);
    };
  }, [selectedAudioInput, selectedVideoInput, startMediaStream]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        closeMediaStream(mediaStream);
        setError({
          allowJoin: false,
          title: '',
          message: '',
        });
      } else {
        startMediaStream();
      }
    }
    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
      false,
    );
    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
        false,
      );
    };
  }, [mediaStream, startMediaStream]);

  const handleDeviceChange = useCallback((values: SettingsFormProps) => {
    values?.selectedAudioInput &&
      setSelectedAudioInput(values.selectedAudioInput);
    values?.selectedVideoInput &&
      setSelectedVideoInput(values.selectedVideoInput);
    onChange(values);
  }, []);

  const inputProps = {
    compact: true,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      setShowValidation(true);
    },
    value: name,
    validation:
      showValidation && (!name || !name.trim()) ? 'Please enter name' : '',
    required: true,
  };

  return (
    // root
    <div className={styler('root')}>
      <div className={styler('containerRoot')}>
        {/* header */}
        <div className={styler('header')}>
          {/* messageModal */}
          <MessageModal
            show={showModal}
            title={error.title}
            body={error.message}
            onClose={() => {
              if (error.allowJoin) {
                setShowModal(false);
                return;
              }
              errorOnClick();
            }}
          />
          {/* videoTile */}
          <VideoTile
            {...videoTileProps}
            videoTrack={mediaStream?.getVideoTracks()[0]}
            isAudioMuted={audioMuted}
            isVideoMuted={videoMuted}
            audioTrack={mediaStream?.getAudioTracks()[0]}
            peer={
              {
                id: name,
                name: name,
                isLocal: true,
              } as HMSPeer
            }
            objectFit="cover"
            aspectRatio={{
              width: 1,
              height: 1,
            }}
            classes={videoTileClasses}
            controlsComponent={
              <PreviewControls
                audioButtonOnClick={() => toggleMediaState('audio')}
                videoButtonOnClick={() => toggleMediaState('video')}
                isAudioMuted={audioMuted}
                isVideoMuted={videoMuted}
                onChange={handleDeviceChange}
              />
            }
          />
        </div>
        {/* helloDiv */}
        <div className={styler('helloDiv')}>Hi There</div>
        {/* nameDiv */}
        <div className={styler('nameDiv')}>What's your name?</div>
        {/* inputFieldRoot */}
        <div className={styler('inputRoot')}>
          <Input
            ref={inputRef}
            {...inputProps}
            autoCorrect="off"
            autoComplete="name"
          />
        </div>

        {/* joinButton */}
        <Button
          variant="emphasized"
          size="lg"
          iconRight={inProgress}
          icon={inProgress ? <ProgressIcon /> : undefined}
          disabled={inProgress}
          onClick={async () => {
            if (!name || !name.trim()) {
              inputRef.current && inputRef.current.focus();
              setShowValidation(true);
              return;
            }
            closeMediaStream(mediaStream);
            setInProgress(true);
            await joinOnClick({ audioMuted, videoMuted, name });
            setInProgress(false);
          }}
        >
          Join
        </Button>
      </div>
    </div>
  );
};
