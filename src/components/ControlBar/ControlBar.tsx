import React from 'react';
import { LeaveRoom } from '../../icons';
import { ButtonDisplayType } from '../../types';

import { AudioButton, VideoButton } from '../MediaIcons';

export interface ControlBarProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  buttonDisplay: ButtonDisplayType;
  classes?: {
    root?: string;
    leaveRoot?: string;
    leavebutton?: string;
  };
  audioButtonOnClick: React.MouseEventHandler;
  videoButtonOnClick: React.MouseEventHandler;
  leaveButtonOnClick: React.MouseEventHandler;
  leftComponents: Array<String>;
  centerComponents: Array<String>;
  rightComponents: Array<String>;
}

export const ControlBar = ({
  isAudioMuted = false,
  isVideoMuted = false,
  buttonDisplay = 'square',
  audioButtonOnClick,
  videoButtonOnClick,
  leaveButtonOnClick,
  classes = {
    root:
      'flex flex-grow h-full justify-center items-center p-3 relative self-center',
    leaveRoot: 'md:flex-none md:right-0 md:absolute self-center p-4',
    leavebutton: `lg:w-40 md:w-36 inline-block p-2 bg-red-main focus:outline-none text-lg text-white`,
  },
  leftComponents = [],
  centerComponents = ['mic', 'cam'],
  rightComponents = ['leave'],

}: ControlBarProps) => {
  return (
    <div className={classes.root}>
      {centerComponents.find( (name ) => name === 'mic')!=undefined && <div className="mr-1">
        <AudioButton
          isAudioMuted={isAudioMuted}
          buttonDisplay={buttonDisplay}
          clickHandler={audioButtonOnClick}
        />
      </div>}
      {centerComponents.find((name)=>name==='cam')!=undefined && <div>
        <VideoButton
          isVideoMuted={isVideoMuted}
          buttonDisplay={buttonDisplay}
          clickHandler={videoButtonOnClick}
        />
      </div>}
      {rightComponents.find((name)=>name==='leave')!=undefined && <div className={classes.leaveRoot}>
        <button
          className={` ${classes.leavebutton} rounded-${
            buttonDisplay === 'square' ? 'lg' : 'full'
          } `}
          onClick={leaveButtonOnClick}
        >
          <div className="inline-block">{LeaveRoom}</div>
          <div className="pl-2 hidden md:inline-block">Leave Room</div>
        </button>
      </div>}
    </div>
  );
};
