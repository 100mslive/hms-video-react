import React from 'react';
import { ButtonDisplayType } from '../../types';

import {
  AudioButton,
  VideoButton,
  LeaveButton,
  ShareScreenButton,
} from '../MediaIcons';

export interface ControlBarProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  buttonDisplay: ButtonDisplayType;
  classes?: {
    root?: string;
    leftRoot?: string;
    centerRoot?: string;
    rightRoot?: string;
  };
  audioButtonOnClick: React.MouseEventHandler;
  videoButtonOnClick: React.MouseEventHandler;
  leaveButtonOnClick: React.MouseEventHandler;
  screenshareButtonOnClick: React.MouseEventHandler;
  leftComponents: Array<React.ReactNode>;
  centerComponents: Array<React.ReactNode>;
  rightComponents: Array<React.ReactNode>;
}

export const ControlBar = ({
  isAudioMuted = false,
  isVideoMuted = false,
  buttonDisplay = 'square',
  audioButtonOnClick,
  videoButtonOnClick,
  leaveButtonOnClick,
  screenshareButtonOnClick,
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
    <ShareScreenButton
      buttonDisplay={buttonDisplay}
      clickHandler={screenshareButtonOnClick}
    />,
  ],
  centerComponents = [
    <VideoButton
      isVideoMuted={isVideoMuted}
      buttonDisplay={buttonDisplay}
      clickHandler={videoButtonOnClick}
    />,
    <AudioButton
      isAudioMuted={isAudioMuted}
      buttonDisplay={buttonDisplay}
      clickHandler={audioButtonOnClick}
    />,
  ],
  rightComponents = [
    <LeaveButton
      buttonDisplay={buttonDisplay}
      clickHandler={leaveButtonOnClick}
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
