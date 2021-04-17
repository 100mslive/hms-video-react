import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import { Peer } from '../../types';
import { Video, VideoProps, VideoClasses } from '../Video';
import { VideoTileControls } from './Controls';
import { Avatar } from '../Avatar';
import { getVideoTileLabel, largestRect } from '../../utils';

export interface VideoTileProps extends VideoProps {
  /**
   * MediaStream to be displayed.
   */
  stream: MediaStream; //TODO move to Video
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

export const VideoTile = ({
  stream,
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
  classes = {
    root: 'w-full h-full flex relative items-center justify-center',
    videoContainer: 'relative rounded-lg shadow-lg',
    avatarContainer:
      'relative w-full h-full bg-gray-100 flex items-center justify-center',
    avatarContainerCircle: 'rounded-full',
    videoContainerCircle: 'rounded-full',
  },
  controlsComponent,
}: VideoTileProps) => {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [isStreamSet, setIsStreamSet] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    classes.videoCover
      ? {
          video: classes.video,
          videoCircle: classes.videoCircle,
          videoLocal: classes.videoLocal,
          videoCover: classes.videoCover,
          videoContain: classes.videoContain,
        }
      : undefined;

  useEffect(() => {
    if (containerRef && containerRef.current) {
      /*
       * If aspect ratio is defined, container width is the largest rectangle fitting into parent
       * If aspect ratio is not defined, container width is the same as the video dimensions
       */
      //@ts-ignore
      window.stream = stream;
      console.log(stream.getVideoTracks());
      const parent = containerRef.current;
      const {
        width: parentWidth,
        height: parentHeight,
      } = parent.getBoundingClientRect();
      const { width: selfWidth, height: selfHeight } =
        stream && stream.getVideoTracks()[0]
          ? stream.getVideoTracks()[0].getSettings()
          : { width: parentWidth, height: parentHeight };
      const containerAspectRatio =
        objectFit === 'cover'
          ? { width: parentWidth, height: parentHeight }
          : { width: selfWidth, height: selfHeight };
      const containerAspectRatioAfterUserOverride =
        aspectRatio && objectFit === 'cover'
          ? aspectRatio
          : containerAspectRatio;
      const containerAspectRatioAfterShapeOverride = {
        width: isSquareOrCircle
          ? 1
          : containerAspectRatioAfterUserOverride.width,
        height: isSquareOrCircle
          ? 1
          : containerAspectRatioAfterUserOverride.height,
      };
      const { width, height } = largestRect(
        parentWidth,
        parentHeight,
        1,
        containerAspectRatioAfterShapeOverride.width,
        containerAspectRatioAfterShapeOverride.height,
      );
      setHeight(height);
      setWidth(width);
    }
  }, [
    stream,
    aspectRatio,
    displayShape,
    objectFit,
    isStreamSet,
    isSquareOrCircle,
  ]);

  useEffect(() => {
    if (videoRef && videoRef.current && stream) {
      videoRef.current!.srcObject = stream;
    }
    setIsStreamSet(videoRef.current?.srcObject === stream);
  }, [videoRef, stream]);

  return (
    <div ref={containerRef} className={classes.root}>
      <div
        className={`${classes.videoContainer} ${
          displayShape === 'circle' ? classes.videoContainerCircle : ''
        }`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {!isVideoMuted && (
          <Video
            ref={videoRef}
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
        )}
        {isVideoMuted && (
          <div
            className={`${classes.avatarContainer} ${
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
    </div>
  );
};
