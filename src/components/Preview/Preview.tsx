import React, { useEffect, useState, useMemo, useRef } from 'react';
import { HMSConfig } from '@100mslive/hms-video';
import {
  HMSNotificationTypes,
  HMSRoomState,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoDisplayEnabled,
  selectLocalPeer,
  selectRoomState,
} from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { MessageModal } from '../MessageModal';
import { Button } from '../Button';
import { ProgressIcon } from '../Icons';
import { VideoTile, VideoTileProps } from '../VideoTile';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { PreviewControls } from './Controls';
import { Input } from '../Input';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import {
  useHMSActions,
  useHMSNotifications,
  useHMSStore,
} from '../../hooks/HMSRoomProvider';
import { isBrowser } from '../../utils/is-browser';

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
  errorImage?: string;
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
  errorImage: 'mt-3',
};
export interface PreviewProps {
  config: HMSConfig;
  joinOnClick: ({ audioMuted, videoMuted, name }: JoinInfo) => void;
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
  videoTileProps,
  classes,
  videoTileClasses,
}: PreviewProps) => {
  const { tw } = useHMSTheme();
  const localPeer = useHMSStore(selectLocalPeer);
  const hmsActions = useHMSActions();
  const notification = useHMSNotifications();
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
    title: '',
    message: '',
  });

  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoDisplayEnabled);

  const setAudioEnabled = hmsActions.setLocalAudioEnabled.bind(hmsActions);
  const setVideoEnabled = hmsActions.setLocalVideoEnabled.bind(hmsActions);

  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const clearError = () => {
    setError({ title: '', message: '' });
  };

  const permissionPromptError = {
    title: 'Grant Cam/Mic Permission',
    message:
      'Please click in the prompt you see on the top right corner below the address bar',
  };

  useEffect(() => {
    let timeoutId: number | undefined;
    if (roomState === HMSRoomState.Connecting && isBrowser) {
      /**
       * Assumed: If room state stays connecting for 1.5 seconds,
       * permission is not given
       */
      timeoutId = window.setTimeout(() => {
        if (roomState === HMSRoomState.Connecting) {
          setError(permissionPromptError);
        }
      }, 1500);
    } else {
      if (error.title === permissionPromptError.title) {
        clearError();
      }
    }

    return () => {
      if (isBrowser) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [roomState]);

  useEffect(() => {
    if (
      notification?.type === HMSNotificationTypes.ERROR &&
      notification.data?.action === 'TRACK'
    ) {
      setError({
        title: notification.data?.name,
        message: notification.data?.message,
      });
    }

    return () => {
      if (error.title) hmsActions.leave();
    };
  }, [hmsActions, notification]);

  useEffect(() => {
    hmsActions.preview(config);
    if (isBrowser) {
      window.onunload = () => hmsActions.leave();
    }
  }, [config.authToken]);

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

  const gifSrc =
    error.title === permissionPromptError.title
      ? '/permission-prompt.gif'
      : notification?.data?.code === 3001
      ? '/permission-denied.gif'
      : undefined;

  return (
    // root
    <div className={styler('root')}>
      <div className={styler('containerRoot')}>
        {/* header */}
        <div className={styler('header')}>
          {/* messageModal */}
          <MessageModal
            show={Boolean(error.title)}
            title={error.title}
            body={
              <>
                <p>{error.message}</p>
                {gifSrc && (
                  <img
                    className={styler('errorImage')}
                    src={gifSrc}
                    alt={gifSrc}
                  />
                )}
              </>
            }
            onClose={() => {
              errorOnClick();
            }}
          />
          {/* videoTile */}
          {localPeer ? (
            <VideoTile
              {...videoTileProps}
              peer={{ ...localPeer, name }}
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
            if (inProgress) {
              return;
            }
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
