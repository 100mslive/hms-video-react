import React from 'react';
import { MicOff, MicOn, CamOff, CamOn, Logo, LeaveRoom } from '../../icons';

export const LogoButton = () => {
  return (
    <button className="inline-block p-2 focus:outline-none">{Logo}</button>
  );
};

export const AudioMuteButton = ({ isAudioMuted = false }) => {
  return (
    <button
      className={`inline-block p-2 rounded-lg focus:outline-none ${
        isAudioMuted
          ? 'bg-red-main hover:bg-red-tint'
          : 'hover:bg-transparent-light'
      }`}
    >
      {isAudioMuted ? MicOff : MicOn}
    </button>
  );
};

export const AudioButton = ({ isAudioMuted = false, buttonDisplay = 'square' }) => {
  return (
    <button
      className={`inline-block p-2 rounded-${buttonDisplay=='square'?'lg':'full'} focus:outline-none ${
        isAudioMuted
          ? 'bg-red-main hover:bg-red-tint'
          : 'hover:bg-transparent-light'
      }`}
    >
      {isAudioMuted ? MicOff : MicOn}
    </button>
  );
};

export const VideoButton = ({ isVideoMuted = false, buttonDisplay = 'square' }) => {
  return (
    <button
      className={`inline-block p-2 rounded-${buttonDisplay=='square'?'lg':'full'} focus:outline-none ${
        isVideoMuted
          ? 'bg-red-main hover:bg-red-tint'
          : 'hover:bg-transparent-light'
      }`}
    >
      {isVideoMuted ? CamOff : CamOn}
    </button>
  );
};


export const LeaveButton = ({buttonDisplay = 'square'}) => {
  return (
    <button
      className={`inline-block p-2 rounded-${buttonDisplay=='square'?'lg':'full'} focus:outline-none bg-red-main`}
    >
      {LeaveRoom}
    </button>
  );
};


export const AudioMuteIndicator = ({
  isAudioMuted = false,
  className = '',
}) => {
  return (
    <span
      className={`inline-block p-1 rounded-lg ${
        isAudioMuted ? 'bg-red-main' : ''
      } ${className}`}
    >
      {isAudioMuted ? MicOff : MicOn}
    </span>
  );
};
