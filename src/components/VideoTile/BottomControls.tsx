import React from 'react';
import { MicOff, MicOn } from '../../icons';
import { AudioLevelDisplayType } from '../../types';
import AudioLevelIndicator from '../AudioLevelIndicators/index';
import './index.css';

interface BottomControlsProps {
  label: string;
  isAudioMuted?: boolean;
  showGradient?: boolean;
  showAudioMuteStatus?: boolean;
  allowRemoteMute?: boolean;
  showControls?: boolean;
  showAudioLevel?: boolean;
  audioLevelDisplayType?: AudioLevelDisplayType;
  audioLevel?: number;
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

function AudioMuteIndicator({ isAudioMuted = false, className = '' }) {
  return (
    <span
      className={`inline-block p-1 rounded-lg ${
        isAudioMuted ? 'bg-red-main' : ''
      } ${className}`}
    >
      {isAudioMuted ? MicOff : MicOn}
    </span>
  );
}

export default function BottomControls({
  label,
  isAudioMuted = false,
  showGradient = true,
  showAudioMuteStatus = true,
  allowRemoteMute = false,
  showControls = false,
  showAudioLevel = false,
  audioLevelDisplayType = 'inline-wave',
  audioLevel,
}: BottomControlsProps) {
  let labelLayer = <span>{label}</span>;
  let controlLayer = null;

  if ((showAudioLevel || showAudioMuteStatus) && !showControls) {
    let audioStatus;
    if (showAudioMuteStatus)
      audioStatus = <AudioMuteIndicator isAudioMuted={isAudioMuted} />;
    if (showAudioLevel && audioLevelDisplayType != 'border')
      if (isAudioMuted)
        audioStatus = <AudioMuteIndicator isAudioMuted={isAudioMuted} />;
      else
        audioStatus = (
          <AudioLevelIndicator
            type={audioLevelDisplayType}
            level={audioLevel as number}
          />
        );

    labelLayer = (
      <div className="flex items-center w-full mx-2">
        <div className="flex-1 text-left">{audioStatus}</div>
        <span>{label}</span>
        <div className="flex-1"></div>
      </div>
    );
  }

  if (showControls) {
    controlLayer = (
      <div className="bottom-controls text-center mt-1">
        {allowRemoteMute ? (
          <AudioMuteButton isAudioMuted={isAudioMuted} />
        ) : (
          <AudioMuteIndicator isAudioMuted={isAudioMuted} />
        )}
      </div>
    );
  }

  return (
    <div
      className="bottom-controls-container pb-2 text-center text-white rounded-lg"
      style={!showGradient ? { background: 'none' } : {}}
    >
      {labelLayer}
      {controlLayer}
    </div>
  );
}
