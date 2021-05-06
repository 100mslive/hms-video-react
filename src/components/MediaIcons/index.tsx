import React from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import {
  MicOffIcon,
  MicOnIcon,
  CamOffIcon,
  CamOnIcon,
  Logo,
  HangUpIcon,
  ShareScreenIcon,
  StarIcon,
  StarFillIcon,
  CloseIcon,
  ChatIcon,
  SettingsIcon,
  VolumeIcon,
} from '../../icons';

export const LogoButton = () => {
  //TODO check this code
  let logo;
  try {
    const { appBuilder } = useHMSTheme();
    logo = appBuilder.logo;
  } catch (e) {}
  return (
    <button className=" p-2 focus:outline-none">
      {logo ? (
        <img
          src={logo}
          alt="brand_logo"
          // className=" md:object-contain object-scale-down md:h-full"
          className="object-contain flex justify-center h-6 "
        />
      ) : (
        Logo
      )}
    </button>
  );
};

export const AudioMuteButton = ({ isAudioMuted = false }) => {
  return (
    <button
      className={`inline-block p-2 rounded-lg focus:outline-none ${
        isAudioMuted
          ? 'bg-red-main hover:bg-red-tint'
          : 'hover:bg-transparent-300'
      }`}
    >
      {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
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
          : 'hover:bg-transparent-300'
      }`}
      onClick={clickHandler}
    >
      {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
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
          : 'hover:bg-transparent-300'
      }`}
      onClick={clickHandler}
    >
      {isVideoMuted ? <CamOffIcon /> : <CamOnIcon />}
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
      <div className="inline-block">
        <HangUpIcon />
      </div>
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
      {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
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
      className={`inline-block p-1 rounded-${
        buttonDisplay === 'square' ? 'lg' : 'full'
      } focus:outline-none hover:bg-transparent-300`}
      onClick={clickHandler}
    >
      <ShareScreenIcon />
    </button>
  );
};

export const MuteListButton = ({ isMuteOn = false }) => {
  return (
    <button className="inline-block p-1 opacity-0 hover:opacity-100 focus:outline-none">
      {isMuteOn ? <MicOffIcon /> : <MicOnIcon />}
    </button>
  );
};

export const SpotlightListButton = ({ isSpotlightOn = false }) => {
  return (
    <button className="inline-block p-1 opacity-0 hover:opacity-100 focus:outline-none ">
      {isSpotlightOn ? <StarIcon /> : <StarFillIcon />}
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
        isAudioMuted ? 'bg-white hover:bg-gray-500' : 'hover:bg-transparent-300'
      }`}
      onClick={clickHandler}
    >
      {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
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
        isVideoMuted ? 'bg-white hover:bg-gray-500' : 'hover:bg-transparent-300'
      }`}
      onClick={clickHandler}
    >
      {isVideoMuted ? <CamOffIcon /> : <CamOnIcon />}
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
      } focus:outline-none hover:bg-transparent-300`}
      onClick={clickHandler}
    >
      <SettingsIcon />
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
      <CloseIcon />
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
        'bg-white'} p-2 hover:bg-gray-200  m-1`}
    >
      {isChatOpen ? <ChatIcon /> : <ChatIcon />}
    </button>
  );
};

export const SpeakerTag = ({ name }: { name: string }) => {
  return name ? (
    <div className={`self-center focus:outline-none text-lg text-white`}>
      <div className="inline-block">
        <VolumeIcon />
      </div>
      {/* TODO figure out why xs:hidden is needed */}
      <div className="md:pl-2 xs:hidden md:inline-block">{name}</div>
    </div>
  ) : (
    <></>
  );
};
