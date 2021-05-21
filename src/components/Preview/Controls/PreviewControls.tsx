import React, {useCallback} from 'react';
import '../index.css';
import { ButtonDisplayType } from '../../../types';
import { MicOffIcon, MicOnIcon, CamOnIcon, CamOffIcon } from '../../Icons';
import { Button } from '../../TwButton';
import { Settings, SettingsFormProps } from '../../Settings/Settings';
import { hmsUiClassParserGenerator } from '../../../utils/classes';

export interface VideoTileControlsProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  showGradient?: boolean;
  onChange: (values: SettingsFormProps) => void;
  classes?: PreviewControlsClasses;
  audioButtonOnClick: () => void;
  videoButtonOnClick: React.MouseEventHandler;
  buttonDisplay?: ButtonDisplayType;
}

interface PreviewControlsClasses  {
  root?:string;
  controls?:string;
  rightControls?:string;
}

const defaultClasses:PreviewControlsClasses = {
    root:
      'flex flex-grow absolute bottom-0 w-full p-3 bottom-background z-40 rounded-lg focus:outline-none',
    controls:
      'dark flex flex-grow self-center justify-center inline-block hover-hide space-x-1 relative',
    rightControls:
      'dark flex sm:flex-none md:right-0 md:self-center inline-block md:mx-1 sm:absolute  hover-hide absolute right-3',
}

export const VideoTileControls = ({
  isAudioMuted = false,
  isVideoMuted = false,
  buttonDisplay = 'rectangle',
  audioButtonOnClick,
  videoButtonOnClick,
  onChange,
  classes,
}: VideoTileControlsProps) => {
  const hu = useCallback(
    hmsUiClassParserGenerator<PreviewControlsClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-preview',
    }),
    [],
  );
  return (
    <div className={`${hu('root')}`}>
      <div className={`${hu('controls')}`}>
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
      <div className={`${hu('rightControls')}`}>
        <Settings onChange={onChange} key={0} />
      </div>
    </div>
  );
};
