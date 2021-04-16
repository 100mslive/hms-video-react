import React from 'react';
import { LeaveRoom } from '../../icons';

import { AudioMuteButton, VideoMuteButton } from '../MediaIcons';

export interface ControlBarProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
}

export const ControlBar = ({
  isAudioMuted = false,
  isVideoMuted = false,
}: ControlBarProps) => {
  return (
    <div className="flex h-full p-1 relative items-center">
      <div
        className="flex flex-grow h-full justify-center self-center m-3"
        style={{ background: 'none' }}
      >
        <div className="mr-1">
          <AudioMuteButton isAudioMuted={isAudioMuted} />
        </div>

        <div className="ml=1">
          <VideoMuteButton isVideoMuted={isVideoMuted} />
        </div>
      </div>
      <div className="flex-none right-0 absolute m-2">
        <button className="inline-block right-0 p-2 m-2 w-40 rounded-lg bg-red-main">
          <div className="inline-block pr-1">{LeaveRoom}</div>
          <div className="inline-block pl-1 text-lg text-white">Leave Room</div>
        </button>
      </div>
    </div>
  );
};
