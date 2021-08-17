import React, { useMemo } from 'react';
import { MicOffIcon, MicOnIcon, CamOnIcon, CamOffIcon } from '../../Icons';
import { Button } from '../../Button';
import { Settings } from '../../Settings/Settings';
import { useHMSTheme } from '../../../hooks/HMSThemeProvider';
import { ButtonDisplayType } from '../../../types';
import { hmsUiClassParserGenerator } from '../../../utils/classes';
import '../index.css';

interface PreviewControlsClasses {
  root?: string;
  controls?: string;
  rightcontrols?: string;
}
export interface PreviewControlsProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  showGradient?: boolean;
  classes?: PreviewControlsClasses;
  audioButtonOnClick: () => void;
  videoButtonOnClick: React.MouseEventHandler;
  buttonDisplay?: ButtonDisplayType;
  isAudioAllowed?: boolean;
  isVideoAllowed?: boolean;
}

interface PreviewControlsClasses {
  root?: string;
  controls?: string;
  rightControls?: string;
}

const defaultClasses: PreviewControlsClasses = {
  root:
    'flex absolute bottom-0 w-full p-3 bottom-background z-40 rounded-lg min-h-0 focus:outline-none',
  controls:
    'dark flex flex-1 self-center justify-center hover-hide space-x-1 relative',
  rightControls:
    'dark flex sm:flex-none md:right-0 md:self-center inline-block md:mx-1 sm:absolute  hover-hide absolute right-3',
};

export const PreviewControls = ({
  isAudioMuted = false,
  isVideoMuted = false,
  buttonDisplay = 'rectangle',
  audioButtonOnClick,
  videoButtonOnClick,
  classes,
  isAudioAllowed = true,
  isVideoAllowed = true,
}: PreviewControlsProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<PreviewControlsClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-preview',
      }),
    [],
  );

  return (
    <div className={`${styler('root')}`}>
      <div className={`${styler('controls')}`}>
        {isAudioAllowed && (
          <Button
            iconOnly
            variant="no-fill"
            active={isAudioMuted}
            shape={buttonDisplay}
            onClick={audioButtonOnClick}
          >
            {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
          </Button>
        )}
        {isVideoAllowed && (
          <Button
            iconOnly
            variant="no-fill"
            active={isVideoMuted}
            shape={buttonDisplay}
            onClick={videoButtonOnClick}
          >
            {isVideoMuted ? <CamOffIcon /> : <CamOnIcon />}
          </Button>
        )}
      </div>
      <div className={`${styler('rightControls')}`}>
        <Settings key={0} previewMode={true} />
      </div>
    </div>
  );
};
