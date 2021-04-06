import React from 'react';
import { Peer } from '../../types';
import './index.css';
import BottomControls from './BottomControls';

export interface VideoTileProps {
  stream: MediaStream | string;
  peer: Peer;
  isLocal?: boolean;
  videoSource?: 'screen' | 'camera' | 'canvas';
  audioLevel?: number;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  isDominantSpeaker?: boolean;
  showDominantSpeakerStatus?: boolean;
  showAudioMuteStatus?: boolean;
  showVideoMuteStatus?: boolean;
  showAudioLevel?: boolean;
  displayFit?: 'contain' | 'cover';
  aspectRatio?: [number, number];
  displayShape?: 'circle' | 'rectangle';
  audioLevelDisplayType?:
    | 'inline-wave'
    | 'inline-circle'
    | 'border'
    | 'avatar-circle';
}

export const VideoTile = ({
  stream,
  peer,
  isLocal = false,
  videoSource = 'camera',
  audioLevel,
  isAudioMuted,
  isVideoMuted,
  isDominantSpeaker,
  showAudioMuteStatus,
  showVideoMuteStatus,
  showDominantSpeakerStatus,
  showAudioLevel,
  displayFit = 'contain',
  aspectRatio = [16, 9],
  displayShape = 'rectangle',
  audioLevelDisplayType,
}: VideoTileProps) => {
  return (
    <div className="video-tile inline-block h-full relative m-2">
      <video muted autoPlay className="shadow-lg rounded-lg">
        <source src={stream as string} type="video/mp4" />
        <p>Your browser cannot play the provided video file.</p>
      </video>
      <BottomControls peer={peer} isAudioMuted={isAudioMuted} />
    </div>
  );
};
