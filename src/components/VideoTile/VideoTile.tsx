import React, { useMemo, useState } from 'react';
import {
  HMSPeer,
  selectCameraStreamByPeerID,
  selectIsPeerAudioEnabled,
  selectIsPeerLocallyMuted,
  selectIsPeerVideoEnabled,
  selectScreenShareByPeerID,
} from '@100mslive/hms-video-store';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';
import { Video, VideoProps, VideoClasses } from '../Video/Video';
import { VideoTileControls } from './Controls';
import { Avatar } from '../TwAvatar';
import { MicOffIcon, MicOnIcon, VolumeIcon } from '../Icons';
import { Slider } from '../Slider/Slider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { getVideoTileLabel } from '../../utils';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import './index.css';

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

  avatarType?: 'initial';
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
  videoContainer: 'relative rounded-lg object-cover relative w-full max-h-full',
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
  isAudioMuted,
  isVideoMuted,
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
  const hmsActions = useHMSActions();
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

  if (hmsVideoTrack?.source === 'screen') {
    showScreen = true;
  }

  const selectVideoByPeerID = showScreen
    ? selectScreenShareByPeerID
    : selectCameraStreamByPeerID;
  const storeHmsVideoTrack = useHMSStore(selectVideoByPeerID(peer.id));
  const storeIsAudioMuted = !useHMSStore(selectIsPeerAudioEnabled(peer.id));
  const storeIsVideoMuted = !useHMSStore(selectIsPeerVideoEnabled(peer.id));
  const storeIsLocallyMuted = useHMSStore(selectIsPeerLocallyMuted(peer.id));
  const [volume, setVolume] = useState(100);

  if (showAudioLevel === undefined) {
    showAudioLevel = !showScreen; // don't show audio levels for screenshare
  }

  hmsVideoTrack = hmsVideoTrack || storeHmsVideoTrack;

  if (!showScreen && (isAudioMuted === undefined || isAudioMuted === null)) {
    isAudioMuted = storeIsAudioMuted;
  }

  if (!showScreen && (isVideoMuted === undefined || isVideoMuted === null)) {
    isVideoMuted = storeIsVideoMuted;
  }

  const label = getVideoTileLabel(
    peer.name,
    peer.isLocal,
    hmsVideoTrack?.source,
    storeIsLocallyMuted,
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
      {!peer.isLocal && (
        <ContextMenu>
          <ContextMenuItem
            label={`${storeIsLocallyMuted ? 'Unmute' : 'Mute'} locally`}
            icon={storeIsLocallyMuted ? <MicOnIcon /> : <MicOffIcon />}
            onClick={() => hmsActions.mutePeer(peer.id, !storeIsLocallyMuted)}
          />
          <ContextMenuItem
            label="volume"
            icon={<VolumeIcon />}
            onClick={() => {}}
          >
            <Slider
              value={volume}
              onChange={(_, newValue) => {
                if (typeof newValue === 'number') {
                  setVolume(newValue);
                }
              }}
              aria-labelledby="continuous-slider"
            />
          </ContextMenuItem>
        </ContextMenu>
      )}
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
