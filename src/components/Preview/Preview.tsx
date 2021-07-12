import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  HMSRoomState,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoDisplayEnabled,
  selectLocalPeer,
  selectRoomState,
} from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { MessageModal } from '../MessageModal';
import { SettingsFormProps } from '../Settings/Settings';
import { Button } from '../Button';
import { ProgressIcon } from '../Icons';
import { VideoTile, VideoTileProps } from '../VideoTile';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { PreviewControls } from './Controls';
import { Input } from '../Input';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import HMSConfig from '@100mslive/hms-video/dist/interfaces/config';

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
    'flex w-screen h-full mls:h-auto bg-white dark:bg-black justify-center items-center',
  containerRoot:
    'flex flex-col justify-center items-center w-37.5 h-full md:h-400 pb-4 box-border bg-gray-700 dark:bg-gray-100 text-gray-100 dark:text-white overflow-hidden md:rounded-2xl',
  header:
    'w-4/5 h-2/5 md:w-22.5 md:h-22.5 mt-1.875 mb-7 grid place-items-center',
  helloDiv: 'text-2xl font-medium mb-2',
  nameDiv: 'text-lg leading-6 mb-2',
  inputRoot: 'p-2 mb-3',
};
export interface PreviewProps {
  config: HMSConfig;
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
  config,
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
  const localPeer = useHMSStore(selectLocalPeer);
  const hmsActions = useHMSActions();
  const roomState = useHMSStore(selectRoomState);

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

  /** This is to show error message only when input it touched or button is clicked */
  const [showValidation, setShowValidation] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState({
    allowJoin: false,
    title: '',
    message: '',
  });

  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoDisplayEnabled);

  const setAudioEnabled = hmsActions.setLocalAudioEnabled.bind(hmsActions);
  const setVideoEnabled = hmsActions.setLocalVideoEnabled.bind(hmsActions);

  const [selectedAudioInput, setSelectedAudioInput] = useState('default');
  const [selectedVideoInput, setSelectedVideoInput] = useState('default');
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(Boolean(error.title));
  }, [error.title]);

  window.onunload = () => hmsActions.leave();

  useEffect(() => {
    hmsActions.preview(config);
  }, [config.authToken]);

  useEffect(() => {
    // @ts-ignore
    hmsActions.setVideoSettings({ deviceId: selectedVideoInput });
    // @ts-ignore
    hmsActions.setAudioSettings({ deviceId: selectedAudioInput });
  }, [selectedAudioInput, selectedVideoInput]);

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
      showValidation && (!name || !name.replace(/\u200b/g, ' ').trim())
        ? 'Please enter name'
        : '',
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
          {localPeer ? (
            <VideoTile
              {...videoTileProps}
              peer={localPeer}
              objectFit="cover"
              aspectRatio={{
                width: 1,
                height: 1,
              }}
              classes={videoTileClasses}
              controlsComponent={
                <PreviewControls
                  audioButtonOnClick={() => setAudioEnabled(!audioEnabled)}
                  videoButtonOnClick={() => setVideoEnabled(!videoEnabled)}
                  isAudioMuted={!audioEnabled}
                  isVideoMuted={!videoEnabled}
                  onChange={handleDeviceChange}
                />
              }
            />
          ) : !error.title ? (
            <ProgressIcon width="100" height="100" />
          ) : null}
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
          iconRight={inProgress || roomState === HMSRoomState.Connecting}
          icon={inProgress ? <ProgressIcon /> : undefined}
          disabled={inProgress || roomState === HMSRoomState.Connecting}
          onClick={async () => {
            if (!name || !name.replace(/\u200b/g, ' ').trim()) {
              inputRef.current && inputRef.current.focus();
              setShowValidation(true);
              return;
            }
            setInProgress(true);
            await joinOnClick({
              audioMuted: !audioEnabled,
              videoMuted: !videoEnabled,
              name,
            });
            setInProgress(false);
          }}
        >
          Join
        </Button>
      </div>
    </div>
  );
};
