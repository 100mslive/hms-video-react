import React from 'react';
import { AudioLevelDisplayType } from '../../../types';
import { Button } from '../../Button';
import { MicOffIcon } from '../../Icons';
import '../index.css';
//@ts-ignore
import { apply } from 'twind';
import { useHMSTheme } from '../../../hooks/HMSThemeProvider';
import { resolveClasses } from '../../../utils/classes/resolveClasses';

export interface VideoTileControlsClasses {
  root?: string;
  controlsInner?: string;
  controls?: string;
  gradient?: string;
  controlsStatus?: string;
  hoverHide?: string;
  label?: string;
}
interface StyledVideoTileControlsProps {
  label?: string;
  isAudioMuted?: boolean;
  showGradient?: boolean;
  showAudioMuteStatus?: boolean;
  allowRemoteMute?: boolean;
  showAudioLevel?: boolean;
  audioLevelDisplayType?: AudioLevelDisplayType;
  audioLevel?: number;
  defaultClasses?: VideoTileControlsClasses;
  classes?: VideoTileControlsClasses;
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

export const VideoTileControls = ({
  label = '',
  isAudioMuted = false,
  showGradient = true,
  showAudioMuteStatus = true,
  allowRemoteMute = false,
  showAudioLevel = false,
  audioLevelDisplayType = 'inline-wave',
  audioLevel,
  classes,
}: StyledVideoTileControlsProps) => {
  const finalClasses: VideoTileControlsClasses = resolveClasses(
    classes || {},
    defaultClasses,
  );
  const { tw } = useHMSTheme();
  const parseClass = (s: keyof VideoTileControlsClasses) => {
    return tw(`hmsui-videocontrols-${s}`, apply(finalClasses[s]));
  };
  return (
    <div className={`${parseClass('root')}`}>
      <div className={`${showGradient ? parseClass('gradient') : ''}`} />
      <div className={`${parseClass('controlsInner')}`}>
        <div className="flex justify-center">
          {showAudioMuteStatus && isAudioMuted && !allowRemoteMute && (
            <MicOffIcon />
          )}
          {isAudioMuted && allowRemoteMute && (
            <Button
              variant={'icon-only'}
              active={true}
              size={'md'}
              shape="circle"
              classes={{ root: 'to-be-overridden' }}
            >
              <MicOffIcon />
            </Button>
          )}
        </div>
        <div className={`${parseClass('label')}`}>{label}</div>
        <div className={`${parseClass('controls')}`}>
          {!isAudioMuted && allowRemoteMute && (
            <Button variant={'icon-only'} size={'md'}>
              <MicOffIcon />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export type VideoTileControlsProps = Omit<
  StyledVideoTileControlsProps,
  'defaultClasses'
>;
