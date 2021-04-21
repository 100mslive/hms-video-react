import React from 'react';
import {
  MicOff,
  MicOn,
  CamOff,
  CamOn,
  Logo,
  LeaveRoom,
  ShareScreen,
  MuteList,
  SpotlightList,
} from '../../icons';

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

export const AudioButton = ({
  isAudioMuted = false,
  buttonDisplay = 'square',
  clickHandler,
}: {
  isAudioMuted: boolean;
  buttonDisplay: string;
  clickHandler: React.MouseEventHandler;
}) => {
  return (
    <button
      className={`inline-block p-2 rounded-${
        buttonDisplay === 'square' ? 'lg' : 'full'
      } focus:outline-none ${
        isAudioMuted
          ? 'bg-red-main hover:bg-red-tint'
          : 'hover:bg-transparent-light'
      }`}
      onClick={clickHandler}
    >
      {isAudioMuted ? MicOff : MicOn}
    </button>
  );
};

export const VideoButton = ({
  isVideoMuted = false,
  buttonDisplay = 'square',
  clickHandler,
}: {
  isVideoMuted: boolean;
  buttonDisplay: string;
  clickHandler: React.MouseEventHandler;
}) => {
  return (
    <button
      className={`inline-block p-2 rounded-${
        buttonDisplay === 'square' ? 'lg' : 'full'
      } focus:outline-none ${
        isVideoMuted
          ? 'bg-red-main hover:bg-red-tint'
          : 'hover:bg-transparent-light'
      }`}
      onClick={clickHandler}
    >
      {isVideoMuted ? CamOff : CamOn}
    </button>
  );
};

export const LeaveButton = ({
  buttonDisplay = 'square',
  clickHandler,
}: {
  clickHandler: React.MouseEventHandler;
  buttonDisplay: string;
}) => {
  return (
    // <button
    //   className={`md:hidden inline-block p-2 rounded-${
    //     buttonDisplay === 'square' ? 'lg' : 'full'
    //   } focus:outline-none bg-red-main`}
    // >
    //   {LeaveRoom}
    // </button>
    <button
      className={` md:right-0 md:absolute self-center p-2 lg:w-40 md:w-36 bg-red-main focus:outline-none text-lg text-white rounded-${
        buttonDisplay === 'square' ? 'lg' : 'full'
      } `}
      onClick={clickHandler}
    >
      <div className="inline-block">{LeaveRoom}</div>
      <div className="md:pl-2 hidden md:inline-block">Leave Room</div>
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

export const ShareScreenButton = ({
  buttonDisplay = 'square',
  clickHandler,
}: {
  clickHandler: React.MouseEventHandler;
  buttonDisplay: string;
}) => {
  return (
    <button
      className={`inline-block p-2 rounded-${
        buttonDisplay === 'square' ? 'lg' : 'full'
      } focus:outline-none hover:bg-transparent-light`}
      onClick={clickHandler}
    >
      {ShareScreen}
    </button>
  );
};

export const MuteListButton = () => {
  return (
    <button className="inline-block p-1 focus:outline-none">{MuteList}</button>
  );
};

export const SpotlightListButton = () => {
  return (
    <button className="inline-block p-1 focus:outline-none ">
      {SpotlightList}
    </button>
  );
};
