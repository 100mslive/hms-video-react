import React, { useEffect, useRef, useState } from 'react';
import { Peer } from '../../types';
import './index.css';
import BottomControls from './BottomControls';

export interface VideoTileProps {
  stream: MediaStream;
  peer: Peer;
  className: string;
  isLocal?: boolean;
  videoSource: 'screen' | 'camera' | 'canvas';
  audioLevel?: number;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  isDominantSpeaker?: boolean;
  showDominantSpeakerStatus?: boolean;
  showAudioMuteStatus?: boolean;
  showVideoMuteStatus?: boolean;
  showAudioLevel?: boolean;
  displayFit: 'contain' | 'cover';
  aspectRatio?: {
    width: number;
    height: number;
  };
  displayShape?: 'circle' | 'rectangle';
  audioLevelDisplayType?:
    | 'inline-wave'
    | 'inline-circle'
    | 'border'
    | 'avatar-circle';
  allowRemoteMute: boolean;
}

export const VideoTile = ({
  stream,
  peer,
  className = 'shadow-lg rounded-lg',
  isLocal = false,
  videoSource = 'camera',
  audioLevel,
  isAudioMuted = false,
  isVideoMuted,
  isDominantSpeaker,
  showAudioMuteStatus = true,
  showVideoMuteStatus,
  showDominantSpeakerStatus,
  showAudioLevel,
  displayFit = 'contain',
  aspectRatio = { width: 16, height: 9 },
  displayShape = 'rectangle',
  audioLevelDisplayType,
  allowRemoteMute = false,
}: VideoTileProps) => {
  const [height, setHeight] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isSquareOrCircle =
    (displayShape == 'rectangle' && aspectRatio.width == aspectRatio.height) ||
    displayShape == 'circle';
  const objectFit = isSquareOrCircle ? 'cover' : displayFit;

  let label;
  let videoTileStyle: React.CSSProperties = {};
  let videoStyle: React.CSSProperties = { objectFit: 'cover' };

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
    videoTileStyle['width'] = videoStyle['width'] =
      (aspectRatio.width / aspectRatio.height) * height + 'px';

  if (isLocal && videoSource == 'camera')
    videoStyle['transform'] = 'scale(-1, 1)';

  if (isLocal) {
    if (videoSource == 'screen') label = 'Your Screen';
    else label = 'You';
  } else {
    if (videoSource == 'screen') label = `${peer.displayName}'s Screen`;
    else label = peer.displayName;
  }

  if (showAudioLevel && audioLevel && audioLevelDisplayType == 'border')
    videoStyle['boxShadow'] = `0px 0px ${0.12 *
      audioLevel}px #0F6CFF, 0px 0px ${0.8 * audioLevel}px #0F6CFF`;

  return (
    <div
      className={`video-tile inline-block h-full relative m-2`}
      style={videoTileStyle}
    >
      <video
        muted
        autoPlay
        className={`h-full ${className} ${
          displayShape == 'circle' ? 'rounded-full' : ''
        }`}
        ref={videoRef}
        style={videoStyle}
      ></video>
      <div className="absolute bottom-0 w-full">
        <BottomControls
          label={label}
          isAudioMuted={isAudioMuted}
          showControls={allowRemoteMute || displayShape == 'circle'}
          showAudioMuteStatus={showAudioMuteStatus}
          showGradient={displayShape != 'circle'}
          allowRemoteMute={allowRemoteMute}
        />
      </div>
    </div>
  );
};
