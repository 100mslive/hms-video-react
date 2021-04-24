import React from 'react';
import {
  AudioPreviewButton,
  VideoPreviewButton,
  SettingsButton,
} from '../../MediaIcons';
import '../index.css';
import { ButtonDisplayType } from '../../../types';

export interface VideoTileControlsProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  showGradient?: boolean;
  classes?: {
    root?: string;
    controls?: string;
    rightcontrols?: string;
  };
  audioButtonOnClick: ()=>void;
  videoButtonOnClick: React.MouseEventHandler;
  settingsButtonOnClick: React.MouseEventHandler;
  buttonDisplay?: ButtonDisplayType;
}

export const VideoTileControls = ({
  isAudioMuted = false,
  isVideoMuted = false,
  buttonDisplay = 'square',
  audioButtonOnClick,
  videoButtonOnClick,
  settingsButtonOnClick,
  classes = {
    root: 'flex flex-grow absolute bottom-0 w-full p-3 bottom-background z-50 rounded-lg focus:outline-none',
    controls:
      'flex flex-grow self-center justify-center inline-block hover-hide',
    rightcontrols:
      'flex sm:flex-none md:right-0 md:self-center inline-block md:mx-1 sm:absolute  hover-hide',
  },
}: VideoTileControlsProps) => {
  return (
    <div className={`${classes.root}`}>
      <div className={`${classes.controls}`}>
        <AudioPreviewButton
          clickHandler={audioButtonOnClick}
          buttonDisplay={buttonDisplay}
          isAudioMuted={isAudioMuted}
        />
        <VideoPreviewButton
          clickHandler={videoButtonOnClick}
          buttonDisplay={buttonDisplay}
          isVideoMuted={isVideoMuted}
        />
      </div>
      <div className={`${classes.rightcontrols}`}>
        <SettingsButton
          clickHandler={settingsButtonOnClick}
          buttonDisplay={buttonDisplay}
        />
      </div>
    </div>
  );
};
