import React, {useEffect, useState} from 'react';
import '../index.css';
import { ButtonDisplayType } from '../../../types';
import {
  SettingsIcon,
  MicOffIcon,
  MicOnIcon,
  CamOnIcon,
  CamOffIcon,
} from '../../Icons';
import { Button } from '../../Button';
import { Settings } from '../../Settings/Settings';
import DeviceIds from '../../Settings/DeviceIds'

export interface VideoTileControlsProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  showGradient?: boolean;
  getDevices: ({selectedVideoInput, selectedAudioInput, selectedAudioOutput}: DeviceIds) => void;
  classes?: {
    root?: string;
    controls?: string;
    rightcontrols?: string;
  };
  audioButtonOnClick: () => void;
  videoButtonOnClick: React.MouseEventHandler;
  settingsButtonOnClick: React.MouseEventHandler;
  buttonDisplay?: ButtonDisplayType;
}

export const VideoTileControls = ({
  isAudioMuted = false,
  isVideoMuted = false,
  buttonDisplay = 'rectangle',
  getDevices,
  audioButtonOnClick,
  videoButtonOnClick,
  settingsButtonOnClick,
  classes = {
    root:
      'flex flex-grow absolute bottom-0 w-full p-3 bottom-background z-50 rounded-lg focus:outline-none',
    controls:
      'flex flex-grow self-center justify-center inline-block hover-hide space-x-1',
    rightcontrols:
      'flex sm:flex-none md:right-0 md:self-center inline-block md:mx-1 sm:absolute  hover-hide',
  },
}: VideoTileControlsProps) => {
  const [maxTileCount, setMaxTileCount] = useState(16);


  return (
    <div className={`${classes.root}`}>
      <div className={`${classes.controls}`}>
        <Button
          variant={'icon-only'}
          active={isAudioMuted}
          shape={buttonDisplay}
          onClick={audioButtonOnClick}
        >
          {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
        </Button>
        {/* <AudioPreviewButton
          clickHandler={audioButtonOnClick}
          buttonDisplay={buttonDisplay}
          isAudioMuted={isAudioMuted}
        /> */}
        <Button
          variant={'icon-only'}
          active={isVideoMuted}
          shape={buttonDisplay}
          onClick={videoButtonOnClick}
        >
          {isVideoMuted ? <CamOffIcon /> : <CamOnIcon />}
        </Button>
        {/* <VideoPreviewButton
          clickHandler={videoButtonOnClick}
          buttonDisplay={buttonDisplay}
          isVideoMuted={isVideoMuted}
        /> */}
      </div>
      <div className={`${classes.rightcontrols}`}>
        <Settings
              maxTileCount={maxTileCount}
              setMaxTileCount={setMaxTileCount}
              getDevices={getDevices}
              key={0}
              />
        {/* <SettingsButton
          clickHandler={settingsButtonOnClick}
          buttonDisplay={buttonDisplay}
        /> */}
      </div>
    </div>
  );
};
