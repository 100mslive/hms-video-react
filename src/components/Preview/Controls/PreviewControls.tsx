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
  audioButtonOnClick: React.MouseEventHandler;
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
    root: 'flex flex-grow absolute bottom-0 w-full p-3 bottom-background',
    controls:
      'flex flex-grow md:self-center md:justify-center inline-block hover-hide',
    rightcontrols:
      'flex md:flex-none md:right-0 md:absolute md:self-center inline-block mx-1 hover-hide absolute',
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
