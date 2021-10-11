import React, { useMemo } from 'react';
import { MicOffIcon, MicOnIcon, CamOnIcon, CamOffIcon } from '../../Icons';
import { Button } from '../../Button';
import { Settings } from '../../Settings/Settings';
import { useHMSTheme } from '../../../hooks/HMSThemeProvider';
import { useHMSActions } from '../../../hooks/HMSRoomProvider';
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
  rightControls: 'dark flex items-center justify-self-end',
};

const Controls = ({
  isAudioMuted = false,
  isVideoMuted = false,
  buttonDisplay = 'rectangle',
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
        tag: 'hmsui-preview-controls',
      }),
    [],
  );
  const hmsActions = useHMSActions();

  return (
    <div className={`${styler('root')}`}>
      <div className={`${styler('controls')}`}>
        {isAudioAllowed && (
          <Button
            iconOnly
            variant="no-fill"
            active={isAudioMuted}
            shape={buttonDisplay}
            onClick={() => {
              hmsActions.setLocalAudioEnabled(isAudioMuted);
            }}
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
            onClick={() => {
              hmsActions.setLocalVideoEnabled(isVideoMuted);
            }}
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

export const PreviewControls = React.memo(Controls);
