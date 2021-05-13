import React from 'react';
import { AudioLevelDisplayType } from '../../../types';
import { AudioLevelIndicator } from '../../AudioLevelIndicators/index';
import '../index.css';
import { combineClasses } from '../../../utils';
import { withClasses } from '../../../utils/styles';
import { MicOffIcon, MicOnIcon } from '../../Icons';
import { Button } from '../../Button';

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

export const StyledVideoTileControls = ({
  label = '',
  isAudioMuted = false,
  showGradient = true,
  showAudioMuteStatus = true,
  allowRemoteMute = false,
  showAudioLevel = false,
  audioLevelDisplayType = 'inline-wave',
  audioLevel,
  defaultClasses,
  classes: extraClasses,
}: StyledVideoTileControlsProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);

  return (
    <div className={`${combinedClasses?.root}`}>
      <div className={`${showGradient ? combinedClasses?.gradient : ''}`} />
      <div className={`${combinedClasses?.controlsInner}`}>
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
        <div className={`${combinedClasses?.label}`}>{label}</div>
        <div className={`${combinedClasses?.controls}`}>
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

export const VideoTileControls = withClasses<
  VideoTileControlsClasses | undefined
>(
  defaultClasses,
  'videoTileControls',
)<StyledVideoTileControlsProps>(StyledVideoTileControls);
