import React from 'react';
import { MicOff, MicOn } from '../../icons';
import { Peer } from '../../types';
import AudioLevelIndicators from '../AudioLevelIndicators/index';
import './index.css';

interface BottomControlsProps {
  peer: Peer;
  isAudioMuted?: boolean;
  audioLevel?: number;
  audioLevelDisplayType?:
    | 'inline-wave'
    | 'inline-circle'
    | 'border'
    | 'avatar-circle';
}

function AudioMuteButton({ isAudioMuted = false }) {
  return (
    <span
      className={`inline-block p-2 rounded-lg ${
        isAudioMuted
          ? 'bg-red-main hover:bg-red-tint'
          : 'hover:bg-transparent-light'
      }`}
    >
      {isAudioMuted ? MicOff : MicOn}
    </span>
  );
}

export default function BottomControls({
  peer,
  isAudioMuted = false,
  audioLevel,
  audioLevelDisplayType,
}: BottomControlsProps) {
  return (
    <div className="bottom-controls-container absolute bottom-0 w-full pb-2 text-center text-white">
      <span>
        {audioLevel &&
          !isAudioMuted &&
          audioLevelDisplayType &&
          (audioLevelDisplayType === 'inline-wave' ||
            audioLevelDisplayType === 'inline-circle') && (
            <AudioLevelIndicators
              audioLevelDisplayType={audioLevelDisplayType}
              level={audioLevel}
            />
          )}
        {peer.displayName}
      </span>

      <div className="bottom-controls text-center mt-1">
        <AudioMuteButton isAudioMuted={isAudioMuted} />
      </div>
    </div>
  );
}
