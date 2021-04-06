import React from 'react';
import { MicOff, MicOn } from '../../icons';
import { Peer } from '../../types';
import './index.css';

interface BottomControlsProps {
  peer: Peer;
  isAudioMuted?: boolean;
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
}: BottomControlsProps) {
  return (
    <div className="bottom-controls-container absolute bottom-0 w-full pb-2 text-center text-white rounded-lg">
      <span>{peer.displayName}</span>
      <div className="bottom-controls text-center mt-1">
        <AudioMuteButton isAudioMuted={isAudioMuted} />
      </div>
    </div>
  );
}
