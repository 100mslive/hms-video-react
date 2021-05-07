import React, { useEffect, useState } from 'react';
import './index.css';
import { Peer } from '../../types';
import { Video, VideoProps, VideoClasses } from '../Video';
import { VideoTileControls } from './Controls';
import { Avatar } from '../Avatar';
import {
  getTileContainerDimensions,
  getVideoTileLabel,
  combineClasses,
} from '../../utils';
import { useResizeDetector } from 'react-resize-detector';
import { withClasses } from '../../utils/styles';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
interface StyledVideoTileProps extends VideoProps {
  /**
   * HMS Peer object for which the tile is shown.
   */
  peer: Peer;

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
   * default classes
   */
  defaultClasses?: VideoTileClasses;
  /**
   * extra classes added  by user
   */
  classes?: VideoTileClasses;
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
  root:
    'group w-full h-full flex relative items-center justify-center rounded-lg',
  videoContainer: 'relative rounded-lg shadow-lg z-10',
  avatarContainer:
    'absolute w-full h-full top-0 left-0 z-10 bg-gray-100 flex items-center justify-center rounded-lg',
  videoContainerCircle: 'rounded-full',
};

const StyledVideoTile = ({
  videoTrack,
  audioTrack,
  peer,
  isLocal = false,
  videoSource = 'camera',
  audioLevel,
  isAudioMuted = false,
  isVideoMuted = false,
  showAudioMuteStatus,
  showAudioLevel = true,
  objectFit = 'cover',
  aspectRatio,
  displayShape = 'rectangle',
  audioLevelDisplayType = 'border',
  audioLevelDisplayColor = '#0F6CFF',
  allowRemoteMute = false,
  controlsComponent,
  classes: extraClasses,
  defaultClasses,
}: StyledVideoTileProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const label = getVideoTileLabel(peer.displayName, isLocal, videoSource);
  const isSquare =
    displayShape === 'rectangle' &&
    aspectRatio &&
    aspectRatio.width === aspectRatio.height;
  const isCircle = displayShape === 'circle';
  const isSquareOrCircle = isSquare || isCircle;

  try {
    let context = useHMSTheme();
    if (aspectRatio === undefined) {
      aspectRatio = context.appBuilder.videoTileAspectRatio;
    }
    if (showAudioMuteStatus === undefined) {
      showAudioMuteStatus = context.appBuilder.showAvatar;
    }
  } catch (e) {}

  const {
    width: containerWidth,
    height: containerHeight,
    ref: containerRef,
  } = useResizeDetector();

  useEffect(() => {
    if (containerWidth && containerHeight) {
      /*
       * If aspect ratio is defined, container width is the largest rectangle fitting into parent
       * If aspect ratio is not defined, container width is the same as the video dimensions
       */
      const { width, height } = getTileContainerDimensions({
        parentWidth: containerWidth,
        parentHeight: containerHeight,
        videoTrack,
        objectFit,
        aspectRatio,
        isSquareOrCircle,
      });
      setHeight(height);
      setWidth(width);
    }
  }, [
    videoTrack,
    aspectRatio,
    displayShape,
    objectFit,
    isSquareOrCircle,
    containerWidth,
    containerHeight,
  ]);

  return (
    <div ref={containerRef} className={combinedClasses?.root}>
      {containerHeight && containerWidth && (
        <div
          className={`${combinedClasses?.videoContainer} ${
            displayShape === 'circle'
              ? combinedClasses?.videoContainerCircle
              : ''
          }`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <Video
            videoTrack={videoTrack}
            audioTrack={audioTrack}
            objectFit={objectFit}
            isLocal={isLocal}
            videoSource={videoSource}
            showAudioLevel={showAudioLevel}
            audioLevel={audioLevel}
            audioLevelDisplayType={audioLevelDisplayType}
            audioLevelDisplayColor={audioLevelDisplayColor}
            displayShape={displayShape}
          />
          {isVideoMuted && (
            <div
              className={`${combinedClasses?.avatarContainer} ${
                displayShape === 'circle'
                  ? combinedClasses?.avatarContainerCircle
                  : ''
              }`}
            >
              <Avatar label={peer.displayName} />
            </div>
          )}
          {controlsComponent ? (
            controlsComponent
          ) : (
            <VideoTileControls
              label={label}
              isAudioMuted={isAudioMuted}
              showAudioMuteStatus={showAudioMuteStatus}
              showGradient={!isCircle}
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

export type VideoTileProps = Omit<StyledVideoTileProps, 'defaultClasses'>;

export const VideoTile = withClasses<VideoTileClasses | undefined>(
  defaultClasses,
  'videoTile',
)<StyledVideoTileProps>(StyledVideoTile);
