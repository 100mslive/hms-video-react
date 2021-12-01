import React, { useEffect, useState, useMemo, useRef, Fragment } from 'react';
import { HMSConfig } from '@100mslive/hms-video';
import {
  HMSRoomState,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoDisplayEnabled,
  selectLocalPeer,
  selectRoomState,
  selectIsAllowedToPublish,
} from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { Button } from '../Button';
import { ProgressIcon, DotIcon } from '../Icons';
import { VideoTile, VideoTileProps } from '../VideoTile';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { PreviewControls } from './Controls';
import { Input } from '../Input';
import { Text } from '../Text';
import { ButtonClasses } from '../Button/Button';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { isBrowser } from '../../utils/is-browser';
import { isMobileDevice, isSafari } from '../../utils';

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
  joinButton?: Partial<ButtonClasses>;
  videoTile?: Partial<VideoTileClasses>;
}
const defaultClasses: PreviewClasses = {
  root: 'flex w-screen h-full mls:h-auto bg-white dark:bg-black justify-center items-center',
  containerRoot:
    'flex flex-col justify-center items-center w-37.5 h-full md:h-400 pb-4 box-border bg-gray-700 dark:bg-gray-100 text-gray-100 dark:text-white overflow-hidden md:rounded-2xl',
  header:
    'w-4/5 h-2/5 md:w-22.5 md:h-22.5 mt-1.875 mb-7 grid place-items-center',
  helloDiv: 'text-2xl font-medium mb-2',
  nameDiv: 'text-lg leading-6 mb-2',
  inputRoot: 'p-2 mb-1',
};
export interface PreviewProps {
  config: HMSConfig;
  joinOnClick: ({ audioMuted, videoMuted, name }: JoinInfo) => void;
  videoTileProps?: Partial<VideoTileProps>;
  onNameChange?: (name: string) => void;
  /**
   * extra classes added  by user
   */
  classes?: Partial<PreviewClasses>;
}

export const Preview = ({
  config,
  joinOnClick,
  videoTileProps,
  classes,
  onNameChange,
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

  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoDisplayEnabled);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);

  const [name, setName] = useState(config.userName || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Call preview only when roomState is in disconnected state
    if (roomState === HMSRoomState.Disconnected) {
      hmsActions.preview(config);
    }
    if (isBrowser) {
      window.onunload = () => hmsActions.leave();
    }
  }, [config.authToken, roomState]);

  const inputProps = {
    compact: true,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      onNameChange?.(e.target.value);
      setShowValidation(true);
    },
    value: name,
    validation:
      showValidation && (!name || !name.replace(/\u200b/g, ' ').trim())
        ? 'Please enter name'
        : '',
    required: true,
  };

  const disableJoin = inProgress || roomState !== HMSRoomState.Preview;

  return (
    <Fragment>
      {/* root */}
      <div className={styler('root') as string}>
        <div className={styler('containerRoot') as string}>
          {/* header */}
          <div className={styler('header') as string}>
            {/* videoTile */}
            {localPeer ? (
              <VideoTile
                {...videoTileProps}
                peer={{ ...localPeer, name }}
                hmsVideoTrackId={localPeer.videoTrack}
                objectFit="cover"
                aspectRatio={{
                  width: 1,
                  height: 1,
                }}
                classes={classes?.videoTile}
                controlsComponent={
                  <PreviewControls
                    isAudioMuted={!audioEnabled}
                    isVideoMuted={!videoEnabled}
                    isAudioAllowed={isAllowedToPublish.audio}
                    isVideoAllowed={isAllowedToPublish.video}
                  />
                }
              />
            ) : (
              <ProgressIcon width="100" height="100" />
            )}
          </div>
          {/* helloDiv */}
          <div className={styler('helloDiv') as string}>Hi There</div>
          {/* nameDiv */}
          <div className={styler('nameDiv') as string}>What's your name?</div>
          {/* inputFieldRoot */}
          <div className={styler('inputRoot') as string}>
            <Input
              ref={inputRef}
              {...inputProps}
              autoCorrect="off"
              autoComplete="name"
            />
          </div>
          {/*Warning for safari audio output change*/}
          {isMobileDevice() && isSafari() && (
            <div className="mb-3">
              <DotIcon
                className="fill-current text-yellow-400 inline mr-2"
                width="8"
                height="8"
              />
              <Text size="sm" classes={{ root: 'inline' }}>
                Warning: The audio output can be redirected to earpiece
              </Text>
            </div>
          )}
          {/* joinButton */}
          <Button
            variant="emphasized"
            size="lg"
            iconRight={disableJoin}
            classes={classes?.joinButton}
            icon={inProgress ? <ProgressIcon /> : undefined}
            disabled={disableJoin}
            onClick={async () => {
              if (disableJoin) {
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
    </Fragment>
  );
};
