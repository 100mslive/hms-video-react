import React, { useMemo } from 'react';
import { AudioLevelDisplayType } from '../../../types';
import { Button } from '../../TwButton';
import { MicOffIcon } from '../../Icons';
import '../index.css';
import { hmsUiClassParserGenerator } from '../../../utils/classes';
import {useHMSTheme} from '../../../hooks/HMSThemeProvider'

export interface VideoTileControlsClasses {
  root?: string;
  controlsInner?: string;
  controls?: string;
  gradient?: string;
  controlsStatus?: string;
  hoverHide?: string;
  label?: string;
}
export interface VideoTileControlsProps {
  label?: string;
  isAudioMuted?: boolean;
  showGradient?: boolean;
  showAudioMuteStatus?: boolean;
  allowRemoteMute?: boolean;
  showAudioLevel?: boolean;
  audioLevelDisplayType?: AudioLevelDisplayType;
  audioLevel?: number;
  classes?: VideoTileControlsClasses;
  isLocal?: boolean;
}

//TODO group hover is not working
const defaultClasses: VideoTileControlsClasses = {
  root: 'absolute bottom-0 w-full z-20 rounded-none h-24 overflow-hidden',
  // TODO solve for smaller tiles
  controlsInner:
    'absolute bottom-0 w-full h-full z-20 pb-2 text-white px-2 text-center flex flex-col justify-end items-center',
  controls: 'invisible max-h-0 transition-all text-center mt-1',
  gradient:
    'absolute bottom-0 z-0 h-16 w-full bg-gradient-to-t from-transparent-400 to-transparent-0',
  controlsStatus: 'transition-all opacity-1 mx-1',
  label: 'mt-1 mx-1',
};

const customClasses: VideoTileControlsClasses = {
  controls: 'hmsui-videoTile-showControlsOnHoverChild',
};

export const VideoTileControls = ({
  label = '',
  isAudioMuted = false,
  showGradient = true,
  showAudioMuteStatus = true,
  isLocal = false,
  allowRemoteMute = false,
  classes,
}: VideoTileControlsProps) => {
  const {tw} = useHMSTheme();
  const styler = useMemo(()=>
    hmsUiClassParserGenerator<VideoTileControlsClasses>({
      tw,
      classes,
      customClasses,
      defaultClasses,
      tag: 'hmsui-videoTileControls',
    }),[]);
  return (
    <div className={`${styler('root')}`}>
      <div className={`${showGradient ? styler('gradient') : ''}`} />
      <div className={`${styler('controlsInner')}`}>
        <div className="flex justify-center">
          {showAudioMuteStatus && isAudioMuted && (
            <Button
              iconOnly
              active
              size={'md'}
              shape="circle"
              variant="danger"
              classes={{ root: 'dark' }}
            >
              <MicOffIcon />
            </Button>
          )}
        </div>
        <div className={`${styler('label')}`}>{label}</div>
        <div className={`${styler('controls')}`}>
          {!isLocal && showAudioMuteStatus && !isAudioMuted && allowRemoteMute && (
            <Button iconOnly size={'md'} classes={{ root: 'dark' }}>
              <MicOffIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
