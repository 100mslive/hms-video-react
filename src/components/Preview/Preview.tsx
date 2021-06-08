import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { closeMediaStream } from '../../utils';
import { getLocalStream } from '@100mslive/hms-video';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import {
  BrowserOSError,
  getLocalStreamException,
  isBrowserOSValid,
} from '../../utils/preview';
import { MessageModal } from '../MessageModal';
import { SettingsFormProps } from '../Settings/Settings';
import { Button } from '../Button';
import { VideoTile, VideoTileProps } from '../VideoTile';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { VideoTileControls } from './Controls';
import HMSLogger from '../../utils/ui-logger';
import { HMSPeer } from '@100mslive/hms-video-store';
import { Input } from '../Input';

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
    'flex flex-col items-center w-37.5 h-400 box-border bg-gray-700 dark:bg-gray-100 text-gray-100 dark:text-white overflow-hidden rounded-2xl',
  header: 'w-22.5 h-22.5 mt-1.875 mb-7',
  helloDiv: 'text-2xl font-medium mb-2',
  nameDiv: 'text-lg leading-6 mb-2',
  inputRoot: 'w-1/3 p-2 mb-3 ',
};
export interface PreviewProps {
  joinOnClick: ({ audioMuted, videoMuted, name }: JoinInfo) => void;
  onChange: (values: SettingsFormProps) => void;
  goBackOnClick: () => void;
  videoTileProps?: Partial<VideoTileProps>;
  videoTileClasses?: VideoTileClasses;
  /**
   * extra classes added  by user
   */
  classes?: PreviewClasses;
}

export const Preview = ({
  joinOnClick,
  goBackOnClick,
  onChange,
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
  const [mediaStream, setMediaStream] = useState(new MediaStream());
  const [error, setError] = useState({
    title: '',
    message: '',
  });
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [selectedAudioInput, setSelectedAudioInput] = useState('default');
  const [selectedVideoInput, setSelectedVideoInput] = useState('default');
  const [name, setName] = useState('');

  const toggleMediaState = (type: string) => {
    if (type === 'audio') {
      mediaStream.getAudioTracks()[0].enabled = audioMuted;
      setAudioMuted(prevMuted => !prevMuted);
    } else if (type === 'video') {
      mediaStream.getVideoTracks()[0].enabled = videoMuted;
      setVideoMuted(prevMuted => !prevMuted);
    }
  };

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(Boolean(error.title));
  }, [error.title]);

  const startMediaStream = async () => {
    closeMediaStream(mediaStream);
    try {
      if (isBrowserOSValid()) {
        const stream = await getLocalStream({
          audio: { deviceId: selectedAudioInput },
          video: { deviceId: selectedVideoInput },
        });
        setMediaStream(stream);
      }
    } catch (err) {
      HMSLogger.e('[Preview]', err.name, err.message);
      if (err instanceof BrowserOSError) {
        const localStreamError = getLocalStreamException(err.name);
        setError(localStreamError);
      } else {
        setError({
          title: err.description,
          message: err.message,
        });
      }
    }
  };

  window.onunload = () => closeMediaStream(mediaStream);

  useEffect(() => {
    startMediaStream();
    return () => {
      closeMediaStream(mediaStream);
    };
  }, [selectedAudioInput, selectedVideoInput]);

  const handleDeviceChange = useCallback((values: SettingsFormProps) => {
    values?.selectedAudioInput &&
      setSelectedAudioInput(values.selectedAudioInput);
    values?.selectedVideoInput &&
      setSelectedVideoInput(values.selectedVideoInput);
    onChange(values);
  }, []);

  return (
    // root
    <div className={styler('root')}>
      <div className={styler('containerRoot')}>
        {/* header */}
        <div className={styler('header')}>
          {/* messageModal */}
          <MessageModal
            show={showModal}
            setShow={setShowModal}
            title={error.title}
            message={error.message}
            allow={false}
            gobackOnClick={goBackOnClick}
          />
          {/* videoTile */}
          <VideoTile
            {...videoTileProps}
            videoTrack={mediaStream.getVideoTracks()[0]}
            isAudioMuted={audioMuted}
            isVideoMuted={videoMuted}
            audioTrack={mediaStream.getAudioTracks()[0]}
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
              <VideoTileControls
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
            compact
            onChange={e => {
              setName(e.target.value);
            }}
            value={name}
            required
          ></Input>
        </div>

        {/* joinButton */}
        <Button
          variant={'emphasized'}
          size={'lg'}
          onClick={() => {
            if(!name || name.trim() === "") return;
            closeMediaStream(mediaStream);
            joinOnClick({ audioMuted, videoMuted, name });
          }}
        >
          Join
        </Button>
        <Button
          classes={{ rootNoFill: 'mt-3 text-brand-main' }}
          variant={'no-fill'}
          onClick={() => {
            closeMediaStream(mediaStream);
            goBackOnClick();
          }}
        >
          Go back
        </Button>
      </div>
    </div>
  );
};
