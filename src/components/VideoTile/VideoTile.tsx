import React, { useEffect, useState } from 'react';
import './index.css';
import { Peer } from '../../types';
import { Video, VideoProps, VideoClasses } from '../Video';
import { VideoTileControls } from './Controls';
import { Avatar } from '../Avatar';
import { getTileContainerDimensions, getVideoTileLabel } from '../../utils';
import { useResizeDetector } from 'react-resize-detector';
//@ts-ignore
import { apply, CSSRules, tw, Directive, css } from 'twind/css';

export interface VideoTileProps extends VideoProps {
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
   * Additional classes to be included for the components.
   */
  classes?: VideoTileClasses;
  /**
   * Custom controls component to display label, audio mute status, audio level, remote mute control.
   * Default is VideoTileControls.
   */
  controlsComponent?: React.ReactNode;
}

export interface VideoTileClasses extends VideoClasses {
  /**
   * The top-level container.
   */
  root?: Directive<CSSRules>;
  /**
   * The video container.
   */
  videoContainer?: Directive<CSSRules>;
  /**
   * The avatar container.
   */
  avatarContainer?: Directive<CSSRules>;
  /**
   * Classes added to Avatar container if its a circle
   */
  avatarContainerCircle?: Directive<CSSRules>;
  /**
   * Classes added to Video container if its a circle
   */
  videoContainerCircle?: Directive<CSSRules>;
}

export const VideoTile = ({
  videoTrack,
  audioTrack,
  peer,
  isLocal = false,
  videoSource = 'camera',
  audioLevel,
  isAudioMuted = false,
  isVideoMuted = false,
  showAudioMuteStatus = true,
  showAudioLevel = true,
  objectFit = 'cover',
  aspectRatio,
  displayShape = 'rectangle',
  audioLevelDisplayType = 'border',
  audioLevelDisplayColor = '#0F6CFF',
  allowRemoteMute = false,
  //TODO merge classes properly with clsx
  //TODO add a utility to add custom apply in hmsui-componentname-classname format
  classes = {
    root: apply`hmsui-videoTile-root w-full h-full flex relative items-center justify-center rounded-lg`,
    videoContainer: apply`relative rounded-lg shadow-lg z-10`,
    avatarContainer: apply`absolute w-full h-full top-0 left-0 z-10 bg-gray-100 flex items-center justify-center rounded-lg`,
    avatarContainerCircle: apply`rounded-full`,
    videoContainerCircle: apply`rounded-full`,
    video: apply`absolute left-0 top-0 z-10 h-full w-full rounded-lg`,
    videoCircle: apply`rounded-full`,
    videoLocal: apply`${css({ transform: 'scaleX(-1)' })}`,
    videoCover: apply`object-cover`,
    videoContain: apply`object-contain`,
    borderAudioRoot: apply`w-full h-full absolute left-0 top-0 rounded-lg z-0`,
  },
  controlsComponent,
}: VideoTileProps) => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const label = getVideoTileLabel(peer.displayName, isLocal, videoSource);
  const isSquare =
    displayShape === 'rectangle' &&
    aspectRatio &&
    aspectRatio.width === aspectRatio.height;
  const isCircle = displayShape === 'circle';
  const isSquareOrCircle = isSquare || isCircle;
  const videoClasses =
    classes.video ||
    classes.videoCircle ||
    classes.videoLocal ||
    classes.videoContain ||
    classes.videoCover ||
    classes.borderAudioRoot
      ? {
          video: classes.video,
          videoCircle: classes.videoCircle,
          videoLocal: classes.videoLocal,
          videoCover: classes.videoCover,
          videoContain: classes.videoContain,
          borderAudioRoot: classes.borderAudioRoot,
        }
      : undefined;

  const {
    width: containerWidth,
    height: containerHeight,
    ref: containerRef,
  } = useResizeDetector();

  useEffect(() => {
    console.info(
      'HMSui-component: [Videotile] Video track and container dimensions are',
      videoTrack,
      containerHeight,
      containerWidth,
    );
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

  useEffect(() => {
    console.info(
      'HMSui-component: [Videotile] Video and Audio Track is',
      videoTrack,
      audioTrack,
    );
  }, [videoTrack, audioTrack]);

  return (
    <div ref={containerRef} className={tw`${classes.root}`}>
      {containerHeight && containerWidth && (
        <div
          className={tw`${classes.videoContainer} ${
            displayShape === 'circle' ? classes.videoContainerCircle : ''
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
            classes={videoClasses}
          />
          {isVideoMuted && (
            <div
              className={tw`${classes.avatarContainer} ${
                displayShape === 'circle' ? classes.avatarContainerCircle : ''
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
