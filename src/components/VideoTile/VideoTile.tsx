import React, { useMemo } from 'react';
import './index.css';
import { Video, VideoProps, VideoClasses } from '../Video/Video';
import { VideoTileControls } from './Controls';
import { Avatar } from '../TwAvatar';
import { getVideoTileLabel } from '../../utils';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { HMSPeer } from '../../store/schema';
import { useHMSStore } from '../../hooks/HMSRoomProvider';
import {
  selectCameraStreamByPeerID,
  selectIsPeerAudioEnabled,
  selectScreenShareByPeerID,
} from '../../store/selectors';
export interface VideoTileProps extends Omit<VideoProps, 'peerId'> {
  /**
   * HMS Peer object for which the tile is shown.
   */
  peer: HMSPeer;

  /**
   * If showScreen is true, user's screenshare will be shown instead of camera
   */
  showScreen?: boolean;

  /**
   * Indicates if the stream's audio is muted or not. Ignored if showAudioMuteStatus is false.
   */
  isAudioMuted?: boolean;
  /**
   * Indicates if the stream's video is muted or not. Ignored if showVideoMuteStatus is false.
   */
  isVideoMuted?: boolean;
  /**
   * Indicates whether to show the stream's audio mute status. Needs isAudioMuted value to display the status.
   */
  showAudioMuteStatus?: boolean;
  /**
   * Aspect ratio of the video container(if objectFit is set to 'cover').
   * If aspectRatio is defined, the video container expands to fit the largest rectangle maintaining the aspec ratio.
   * If aspectRatio is not defined, the video container takes the parent's width and height.
   * Ignored when displayShape is 'circle' or objectFit is 'contain'.
   */
  aspectRatio?: {
    width: number;
    height: number;
  };
  /**
   * Indicates whether to show controls for remote muting/unmuting other participants.
   */
  allowRemoteMute?: boolean;
  /**
   * Custom controls component to display label, audio mute status, audio level, remote mute control.
   * Default is VideoTileControls.
   */
  controlsComponent?: React.ReactNode;
  /**
   * extra classes added  by user
   */
  classes?: VideoTileClasses;

  avatarType?: 'initial' | 'pebble';
  /**
   * Boolean variable to specify if videoTile is small or not
   */
  compact?: boolean;
}

export interface VideoTileClasses extends VideoClasses {
  /**
   * The top-level container.
   */
  root?: string;
  /**
   * The video container.
   */
  videoContainer?: string;
  /**
   * The avatar container.
   */
  avatarContainer?: string;
  /**
   * Classes added to Avatar container if its a circle
   */
  avatarContainerCircle?: string;
  /**
   * Classes added to Video container if its a circle
   */
  videoContainerCircle?: string;
}

const defaultClasses: VideoTileClasses = {
  root: 'group w-full h-full flex relative justify-center rounded-lg ',
  videoContainer:
    'relative rounded-lg object-cover relative max-w-full max-h-full',
  avatarContainer:
    'absolute w-full h-full top-0 left-0 z-10 bg-gray-100 flex items-center justify-center rounded-lg',
  videoContainerCircle: 'rounded-full',
};

const customClasses: VideoTileClasses = {
  root: 'hmsui-videoTile-showControlsOnHoverParent',
};

export const VideoTile = ({
  videoTrack,
  peer,
  hmsVideoTrack,
  showScreen = false,
  audioLevel = 0,
  isAudioMuted = false,
  isVideoMuted = false,
  showAudioMuteStatus = true,
  showAudioLevel,
  objectFit = 'cover',
  aspectRatio,
  displayShape = 'rectangle',
  audioLevelDisplayType = 'border',
  audioLevelDisplayColor = '#0F6CFF',
  allowRemoteMute = false,
  controlsComponent,
  classes,
  avatarType,
  compact = false,
}: VideoTileProps) => {
  const { appBuilder, tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<VideoTileClasses>({
        tw,
        classes,
        customClasses,
        defaultClasses,
        tag: 'hmsui-videoTile',
      }),
    [],
  );

  const selectVideoByPeerID = showScreen
    ? selectScreenShareByPeerID
    : selectCameraStreamByPeerID;
  const storeHmsVideoTrack = useHMSStore(store =>
    selectVideoByPeerID(store, peer.id),
  );
  const storeIsAudioMuted = !useHMSStore(store =>
    selectIsPeerAudioEnabled(store, peer.id),
  );

  if (showAudioLevel === undefined) {
    showAudioLevel = !showScreen;
  }

  hmsVideoTrack = hmsVideoTrack || storeHmsVideoTrack;

  if (isAudioMuted === undefined || isAudioMuted === null) {
    isAudioMuted = storeIsAudioMuted;
  }

  const label = getVideoTileLabel(
    peer.name,
    peer.isLocal,
    hmsVideoTrack?.source,
  );
  try {
    if (aspectRatio === undefined) {
      aspectRatio = appBuilder.videoTileAspectRatio;
    }
    if (avatarType === undefined) {
      avatarType = appBuilder.avatarType;
    }
  } catch (e) {}
  avatarType = avatarType || 'initial';

  let { width, height } = { width: 1, height: 1 };
  if (hmsVideoTrack) {
    if (hmsVideoTrack?.width && hmsVideoTrack.height) {
      width = hmsVideoTrack.width;
      height = hmsVideoTrack.height;
    }
  } else if (videoTrack) {
    let trackSettings = videoTrack.getSettings();
    width = trackSettings.width || width;
    height = trackSettings.height || width;
  }

  const impliedAspectRatio =
    aspectRatio && objectFit === 'cover' ? aspectRatio : { width, height };
  return (
    <div className={styler('root')}>
      {((impliedAspectRatio.width && impliedAspectRatio.height) ||
        objectFit === 'contain') && (
        <div
          className={`${styler('videoContainer')} ${
            displayShape === 'circle' ? styler('videoContainerCircle') : ''
          } `}
          style={
            objectFit !== 'contain'
              ? {
                  aspectRatio: `${
                    displayShape === 'rectangle'
                      ? impliedAspectRatio.width / impliedAspectRatio.height
                      : 1
                  }`,
                }
              : { objectFit: 'contain', width: '100%', height: '100%' }
          }
        >
          {/* TODO this doesn't work in Safari and looks ugly with contain*/}
          <Video
            peerId={peer.id}
            hmsVideoTrack={hmsVideoTrack}
            videoTrack={videoTrack}
            objectFit={objectFit}
            isLocal={peer.isLocal}
            showAudioLevel={showAudioLevel}
            audioLevel={audioLevel}
            audioLevelDisplayType={audioLevelDisplayType}
            audioLevelDisplayColor={audioLevelDisplayColor}
            displayShape={displayShape}
          />
          {isVideoMuted && (
            <div
              className={`${styler('avatarContainer')} ${
                displayShape === 'circle' ? styler('avatarContainerCircle') : ''
              }`}
            >
              <Avatar
                label={peer.name}
                size={compact ? 'sm' : 'xl'}
                avatarType={avatarType}
              />
            </div>
          )}
          {controlsComponent ? (
            controlsComponent
          ) : (
            // TODO circle controls are broken now
            <VideoTileControls
              isLocal={peer.isLocal}
              label={label}
              isAudioMuted={isAudioMuted}
              showAudioMuteStatus={showAudioMuteStatus}
              showGradient={displayShape === 'circle'}
              allowRemoteMute={allowRemoteMute}
              showAudioLevel={
                showAudioLevel && audioLevelDisplayType !== 'border'
              }
              audioLevelDisplayType={audioLevelDisplayType}
              audioLevel={audioLevel}
            />
          )}
        </div>
      )}
    </div>
  );
};
