import React from 'react';
import '../index.css';
import { ButtonDisplayType } from '../../../types';
import { SettingsIcon, MicOffIcon, MicOnIcon, CamOnIcon, CamOffIcon} from '../../../icons'
import { Button } from '../../Button';

export interface VideoTileControlsProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  showGradient?: boolean;
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
  return (
    <div className={`${classes.root}`}>
      <div className={`${classes.controls}`}>
        {/* @ts-ignore */}
        <Button variant={"icon-only"} active={isAudioMuted} shape={buttonDisplay} onClick={audioButtonOnClick}>{isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}</Button>
        {/* <AudioPreviewButton
          clickHandler={audioButtonOnClick}
          buttonDisplay={buttonDisplay}
          isAudioMuted={isAudioMuted}
        /> */}
        {/* @ts-ignore */}
        <Button variant={"icon-only"} active={isVideoMuted} shape={buttonDisplay} onClick={videoButtonOnClick}>{isVideoMuted ? <CamOffIcon /> : <CamOnIcon />}</Button>
        {/* <VideoPreviewButton
          clickHandler={videoButtonOnClick}
          buttonDisplay={buttonDisplay}
          isVideoMuted={isVideoMuted}
        /> */}
      </div>
      <div className={`${classes.rightcontrols}`}>
        {/* @ts-ignore */}
        <Button variant={"icon-only"} shape={buttonDisplay} onClick={settingsButtonOnClick}><SettingsIcon/></Button>
        {/* <SettingsButton
          clickHandler={settingsButtonOnClick}
          buttonDisplay={buttonDisplay}
        /> */}
      </div>
    </div>
  );
};
