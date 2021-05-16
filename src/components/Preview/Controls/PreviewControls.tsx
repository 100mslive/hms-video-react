import React from 'react';
import '../index.css';
import { ButtonDisplayType } from '../../../types';
import { MicOffIcon, MicOnIcon, CamOnIcon, CamOffIcon } from '../../Icons';
import { Button } from '../../TwButton';
import { Settings, SettingsFormProps } from '../../Settings/Settings';

export interface VideoTileControlsProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  showGradient?: boolean;
  onChange: (values: SettingsFormProps) => void;
  classes?: {
    root?: string;
    controls?: string;
    rightcontrols?: string;
  };
  audioButtonOnClick: () => void;
  videoButtonOnClick: React.MouseEventHandler;
  buttonDisplay?: ButtonDisplayType;
}

export const VideoTileControls = ({
  isAudioMuted = false,
  isVideoMuted = false,
  buttonDisplay = 'rectangle',
  audioButtonOnClick,
  videoButtonOnClick,
  onChange,
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
        <Button
          iconOnly
          variant="no-fill"
          active={isAudioMuted}
          shape={buttonDisplay}
          onClick={audioButtonOnClick}
        >
          {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
        </Button>
        <Button
          iconOnly
          variant="no-fill"
          active={isVideoMuted}
          shape={buttonDisplay}
          onClick={videoButtonOnClick}
        >
          {isVideoMuted ? <CamOffIcon /> : <CamOnIcon />}
        </Button>
      </div>
      <div className={`${classes.rightcontrols}`}>
        <Settings onChange={onChange} key={0} />
      </div>
    </div>
  );
};
