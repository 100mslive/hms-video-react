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
  MuteListOn,
  SpotlightListOn,
  MutePreview,
  VideoPreview,
  Settings,
  Close,
  ChatIconBlack,
  ChatIconWhite,
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
      {/* TODO figure out why xs:hidden is needed */}
      <div className="md:pl-2 xs:hidden md:inline-block">Leave Room</div>
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

export const MuteListButton = ({ isMuteOn = false }) => {
  return (
    <button className="inline-block p-1 opacity-0 hover:opacity-100 focus:outline-none">
      {isMuteOn ? MuteList : MuteListOn}
    </button>
  );
};

export const SpotlightListButton = ({ isSpotlightOn = false }) => {
  return (
    <button className="inline-block p-1 opacity-0 hover:opacity-100 focus:outline-none ">
      {isSpotlightOn ? SpotlightList : SpotlightListOn}
    </button>
  );
};

export const AudioPreviewButton = ({
  isAudioMuted = false,
  buttonDisplay = 'square',
  clickHandler,
}: {
  isAudioMuted: boolean;
  buttonDisplay: string;
  clickHandler: () => void;
}) => {
  return (
    <button
      className={`flex w-9 h-9 mx-1.5 justify-center items-center rounded-${
        buttonDisplay === 'square' ? 'xl' : 'full'
      } focus:outline-none ${
        isAudioMuted
          ? 'bg-white hover:bg-gray-500'
          : 'hover:bg-transparent-light'
      }`}
      onClick={clickHandler}
    >
      {isAudioMuted ? MutePreview : MicOn}
    </button>
  );
};

export const VideoPreviewButton = ({
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
      className={`flex w-9 h-9 mx-1.5 justify-center items-center rounded-${
        buttonDisplay === 'square' ? 'xl' : 'full'
      } focus:outline-none ${
        isVideoMuted
          ? 'bg-white hover:bg-gray-500'
          : 'hover:bg-transparent-light'
      }`}
      onClick={clickHandler}
    >
      {isVideoMuted ? VideoPreview : CamOn}
    </button>
  );
};

export const SettingsButton = ({
  buttonDisplay = 'square',
  clickHandler,
}: {
  clickHandler: React.MouseEventHandler;
  buttonDisplay: string;
}) => {
  return (
    <button
      className={`flex w-9 h-9 justify-center items-center rounded-${
        buttonDisplay === 'square' ? 'xl' : 'full'
      } focus:outline-none hover:bg-transparent-light`}
      onClick={clickHandler}
    >
      {Settings}
    </button>
  );
};

export const CloseButton = ({
  clickHandler,
}: {
  clickHandler: React.MouseEventHandler;
}) => {
  return (
    <button
      className="focus:outline-none p-1 hover:outline-none"
      onClick={clickHandler}
    >
      {Close}
    </button>
  );
};

export const ChatButton = ({
  clickHandler,
  isChatOpen,
}: {
  clickHandler: React.MouseEventHandler;
  isChatOpen: boolean;
}) => {
  return (
    <button
      onClick={clickHandler}
      className={`focus:outline-none rounded-lg ${isChatOpen &&
        'bg-white'} p-3`}
    >
      {isChatOpen ? ChatIconBlack : ChatIconWhite}
    </button>
  );
};
