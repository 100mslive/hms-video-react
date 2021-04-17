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
}

export const ControlBar = ({
  isAudioMuted = false,
  isVideoMuted = false,
  buttonDisplay = 'square',
  classes = {
    root:
      'flex flex-grow h-full justify-center items-center p-3 relative self-center',
    leaveRoot: 'md:flex-none md:right-0 md:absolute self-center p-4',
    leavebutton: `inline-block p-2 bg-red-main focus:outline-none text-lg text-white`,
  },
}: ControlBarProps) => {
  return (
    // <div className="flex h-full p-1 relative items-center">
    <div className={classes.root}>
      <div className="mr-1">
        <AudioButton
          isAudioMuted={isAudioMuted}
          buttonDisplay={buttonDisplay}
        />
      </div>
      <div className="ml-1">
        <VideoButton
          isVideoMuted={isVideoMuted}
          buttonDisplay={buttonDisplay}
        />
      </div>
      {/* <div>
            <LeaveButton buttonDisplay={buttonDisplay}/>
          </div> */}
      <div className={classes.leaveRoot}>
        <button
          className={` ${classes.leavebutton} rounded-${
            buttonDisplay === 'square' ? 'lg' : 'full'
          } `}
        >
          <div className="inline-block">{LeaveRoom}</div>
          <div className="pl-2 hidden md:inline-block">Leave Room</div>
        </button>
      </div>
    </div>
  );
};
