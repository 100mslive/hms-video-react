import React, { useEffect, useRef, useState } from 'react';
import { AudioLevelDisplayType, Peer } from '../../types';
import './index.css';
import { BottomControls, BottomControlsProps } from './BottomControls';
import { Avatar } from '../Avatar';
import { getVideoTileLabel } from '../../utils';

export interface VideoTileProps {
  stream: MediaStream;
  peer: Peer;
  isLocal?: boolean;
  videoSource: 'screen' | 'camera' | 'canvas';
  audioLevel?: number;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  showAudioMuteStatus: boolean;
  showAudioLevel?: boolean;
  objectFit: 'contain' | 'cover';
  aspectRatio?: {
    width: number;
    height: number;
  };
  displayShape?: 'circle' | 'rectangle';
  audioLevelDisplayType?: AudioLevelDisplayType;
  allowRemoteMute: boolean;
  classes?: {
    root?: string;
    video?: string;
    bottomControls?: BottomControlsProps['classes'];
  };
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
  aspectRatio = { width: 16, height: 9 },
  displayShape = 'rectangle',
  audioLevelDisplayType = 'border',
  allowRemoteMute = false,
  classes = {
    root: '',
    video: 'rounded-lg shadow-lg',
  },
}: VideoTileProps) => {
  const [height, setHeight] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isSquareOrCircle =
    (displayShape === 'rectangle' &&
      aspectRatio.width === aspectRatio.height) ||
    displayShape === 'circle';

  const label = getVideoTileLabel(peer.displayName, isLocal, videoSource);
  const videoTileStyle: React.CSSProperties = {};
  const videoStyle: React.CSSProperties = { objectFit };

  useEffect(() => {
    const videoTile = videoRef.current?.parentElement;
    const parent = videoTile?.parentElement;
    const height = parent?.getBoundingClientRect().height as number;
    setHeight(height);
  }, [stream, aspectRatio, displayShape]);

  useEffect(() => {
    if (videoRef && videoRef.current && stream) {
      videoRef.current!.srcObject = stream;
    }
  }, [videoRef, stream]);

  if (isSquareOrCircle)
    videoTileStyle['width'] = videoStyle['width'] = height + 'px';
  else
    videoStyle['width'] =
      (aspectRatio.width / aspectRatio.height) * height + 'px';

  if (isLocal && videoSource === 'camera')
    videoStyle['transform'] = 'scale(-1, 1)';

  if (
    !isAudioMuted &&
    showAudioLevel &&
    audioLevel &&
    audioLevelDisplayType === 'border'
  )
    videoStyle['boxShadow'] = `0px 0px ${0.12 *
      audioLevel}px #0F6CFF, 0px 0px ${0.8 * audioLevel}px #0F6CFF`;

  return (
    <div
      className={`video-tile flex h-full relative items-center m-2 ${classes.root}`}
      style={videoTileStyle}
    >
      <video
        muted
        autoPlay
        className={`h-full ${classes.video} ${
          displayShape === 'circle' ? 'rounded-full' : ''
        }`}
        ref={videoRef}
        style={videoStyle}
      ></video>
      {isVideoMuted && (
        <div className="absolute left-0 right-0 mx-auto text-center z-10">
          <Avatar label={peer.displayName} />
        </div>
      )}
      <div className="absolute bottom-0 w-full">
        <BottomControls
          label={label}
          isAudioMuted={isAudioMuted}
          showAudioMuteStatus={showAudioMuteStatus}
          showGradient={displayShape !== 'circle'}
          allowRemoteMute={allowRemoteMute}
          showAudioLevel={showAudioLevel && audioLevelDisplayType != 'border'}
          audioLevelDisplayType={audioLevelDisplayType}
          audioLevel={audioLevel}
          classes={classes.bottomControls}
        />
      </div>
    </div>
  );
};
