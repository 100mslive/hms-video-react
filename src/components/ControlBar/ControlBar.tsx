import React from 'react';
import { ButtonDisplayType } from '../../types';
import Chat from '../Chat';
import { Message } from '../ChatBox/ChatBox';

import {
  AudioButton,
  VideoButton,
  LeaveButton,
  ShareScreenButton,
  ChatButton,
} from '../MediaIcons';
import { Settings } from '../Settings/Settings';

export interface ControlBarProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  isChatOpen?: boolean;
  buttonDisplay: ButtonDisplayType;
  maxTileCount: number;

  classes?: {
    root?: string;
    leftRoot?: string;
    centerRoot?: string;
    rightRoot?: string;
  };
  audioButtonOnClick: React.MouseEventHandler;
  videoButtonOnClick: React.MouseEventHandler;
  leaveButtonOnClick: React.MouseEventHandler;
  chatButtonOnClick: React.MouseEventHandler;
  screenshareButtonOnClick: React.MouseEventHandler;
  setMaxTileCount: (count: number) => void;

  leftComponents: Array<React.ReactNode>;
  centerComponents: Array<React.ReactNode>;
  rightComponents: Array<React.ReactNode>;
}

export const ControlBar = ({
  isAudioMuted = false,
  isVideoMuted = false,
  isChatOpen = false,
  buttonDisplay = 'square',
  maxTileCount,
  audioButtonOnClick,
  videoButtonOnClick,
  leaveButtonOnClick,
  chatButtonOnClick,
  screenshareButtonOnClick,
  setMaxTileCount,
  classes = {
    root:
      'flex flex-grow h-full items-center p-3 relative gap-x-4 mr-2 ml-2 self-center justify-center',
    leftRoot:
      'flex md:flex-none md:self-center md:justify-center md:left-0 md:ml-2 md:absolute',
    centerRoot:
      'flex md:flex-grow gap-x-4 md:mr-2 md:self-center md:justify-center',
    rightRoot:
      'flex md:flex-none md:right-0 md:absolute md:self-center md:p-3 md:mr-2',
  },
  leftComponents = [
    <Settings maxTileCount={maxTileCount} setMaxTileCount={setMaxTileCount} key={0}/>,
    <ShareScreenButton
      buttonDisplay={buttonDisplay}
      clickHandler={screenshareButtonOnClick}
      key={1}
    />,
    <ChatButton clickHandler={chatButtonOnClick} isChatOpen={isChatOpen} />,
  ],
  centerComponents = [
    <VideoButton
      isVideoMuted={isVideoMuted}
      buttonDisplay={buttonDisplay}
      clickHandler={videoButtonOnClick}
      key={0}
    />,
    <AudioButton
      isAudioMuted={isAudioMuted}
      buttonDisplay={buttonDisplay}
      clickHandler={audioButtonOnClick}
      key={1}
    />,
  ],
  rightComponents = [
    <LeaveButton
      buttonDisplay={buttonDisplay}
      clickHandler={leaveButtonOnClick}
      key={2}
    />,
  ],
}: ControlBarProps) => {
  const leftItems = Array<React.ReactNode>();
  const centerItems = Array<React.ReactNode>();
  const rightItems = Array<React.ReactNode>();

  centerComponents.forEach(comp => {
    centerItems.push(comp);
  });
  rightComponents.forEach(comp => {
    rightItems.push(comp);
  });
  leftComponents.forEach(comp => {
    leftItems.push(comp);
  });
  return (
    <div className={classes.root}>
      <div className={classes.leftRoot}>{leftItems}</div>
      <div className={classes.centerRoot}>{centerItems}</div>
      <div className={classes.rightRoot}>{rightItems}</div>
    </div>
  );
};
