import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { AudioLevelDisplayType, Peer } from '../../types';
import './index.css';
import { VideoTileControls } from './Controls';
import { Avatar } from '../Avatar';
import { getVideoTileLabel } from '../../utils';

export interface VideoTileProps {
  stream: MediaStream;
  peer: Peer;
  isLocal?: boolean;
  /**
   Used to display label for video tile.
    */
  videoSource?: 'screen' | 'camera' | 'canvas';
  /**
    Used for displaying audioLevel of the videoTile, when showAudioLevel prop is true.
    */
  audioLevel?: number;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  showAudioMuteStatus?: boolean;
  showAudioLevel?: boolean;
  objectFit: 'contain' | 'cover';
  aspectRatio?: {
    width: number;
    height: number;
  };
  displayShape?: 'circle' | 'rectangle';
  /**
  Sets display type of Audio Level, inline-wave, inline-circle, border, avatar-circle are types
   */
  audioLevelDisplayType?: AudioLevelDisplayType;
  allowRemoteMute?: boolean;
  classes?: {
    root?: string;
    video?: string;
  };
  controlsComponent?: React.ReactNode;
}

interface VideoProps extends Partial<VideoTileProps> {
  isSquareOrCircle?: boolean;
  height?: number;
  className?: string;
}

const Video = forwardRef(
  (
    {
      objectFit,
      isSquareOrCircle,
      height = 1,
      aspectRatio = { width: 16, height: 9 },
      isLocal,
      videoSource,
      isAudioMuted,
      showAudioLevel,
      audioLevel,
      audioLevelDisplayType,
      displayShape,
      className,
    }: VideoProps,
    ref: React.Ref<HTMLVideoElement>
  ) => {
    const getVideoStyles = () => {
      const videoStyle: React.CSSProperties = { objectFit };

      videoStyle['width'] = isSquareOrCircle
        ? height + 'px'
        : (aspectRatio.width / aspectRatio.height) * height + 'px';
      videoStyle['transform'] =
        isLocal && videoSource === 'camera' ? 'scale(-1, 1)' : undefined;

      videoStyle['boxShadow'] =
        !isAudioMuted &&
        showAudioLevel &&
        audioLevel &&
        audioLevelDisplayType === 'border'
          ? `0px 0px ${0.12 * audioLevel}px #0F6CFF, 0px 0px ${0.8 *
              audioLevel}px #0F6CFF`
          : undefined;

      return videoStyle;
    };

    return (
      <video
        muted
        autoPlay
        className={`h-full ${className} ${
          displayShape === 'circle' ? 'rounded-full' : ''
        }`}
        ref={ref}
        style={getVideoStyles()}
      ></video>
    );
  }
);

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
  aspectRatio = { width: 16, height: 9 },
  displayShape = 'rectangle',
  audioLevelDisplayType = 'border',
  allowRemoteMute = false,
  classes = {
    root: '',
    video: 'rounded-lg shadow-lg',
  },
  controlsComponent,
}: VideoTileProps) => {
  const [height, setHeight] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const label = getVideoTileLabel(peer.displayName, isLocal, videoSource);
  const isSquare =
    displayShape === 'rectangle' && aspectRatio.width === aspectRatio.height;
  const isCircle = displayShape === 'circle';
  const isSquareOrCircle = isSquare || isCircle;

  useEffect(() => {
    const videoTile = videoRef.current?.parentElement;
    const parent = videoTile?.parentElement;
    const height = parent?.clientHeight as number;
    setHeight(height);
  }, [stream, aspectRatio, displayShape]);

  useEffect(() => {
    videoRef.current!.srcObject = videoRef && videoRef.current && stream;
  }, [videoRef, stream]);

  return (
    <div
      className={`video-tile flex h-full relative items-center ${classes.root}`}
      style={{ width: isSquareOrCircle ? height + 'px' : undefined }}
    >
      <Video
        ref={videoRef}
        objectFit={objectFit}
        isSquareOrCircle={isSquareOrCircle}
        height={height}
        aspectRatio={aspectRatio}
        isLocal={isLocal}
        videoSource={videoSource}
        isAudioMuted={isAudioMuted}
        showAudioLevel={showAudioLevel}
        audioLevel={audioLevel}
        audioLevelDisplayType={audioLevelDisplayType}
        displayShape={displayShape}
        className={classes.video}
      />
      {isVideoMuted && (
        <div className="absolute left-0 right-0 mx-auto text-center z-10">
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
          showAudioLevel={showAudioLevel && audioLevelDisplayType !== 'border'}
          audioLevelDisplayType={audioLevelDisplayType}
          audioLevel={audioLevel}
        />
      )}
    </div>
  );
};
