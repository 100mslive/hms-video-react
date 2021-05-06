import React from 'react';
import { AudioLevelDisplayType } from '../../../types';
import { AudioLevelIndicator } from '../../AudioLevelIndicators/index';
import { AudioMuteIndicator, AudioMuteButton } from '../../MediaIcons';
import '../index.css';
import { combineClasses } from '../../../utils';
import { withClasses } from '../../../utils/styles';
export interface VideoTileControlsClasses {
  root?: string;
  labelContainer?: string;
  controls?: string;
  rootGradient?: string;
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
  root:
    'absolute bottom-0 w-full pb-2 text-white px-2 text-center rounded-lg z-20',
  labelContainer: 'transition-all',
  controls:
    'bottom-controls max-h-0 transition-all invisible text-center mt-1 group-hover:visible group-hover:max-h-125',
  rootGradient: 'bg-gradient-to-t from-transparent-100 to-transparent-500',
  controlsStatus: 'transition-all opacity-1 mx-1',
  hoverHide: 'group-hover:opacity-0',
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

  //Map [showAudioMuteStatus, showAudioLevel, isAudioMuted] to audio status - actual element to render.
  const audioStatusMap = new Map<string, React.ReactNode>([
    [
      [true, true, true].toString(),
      <AudioMuteIndicator isAudioMuted={isAudioMuted} />,
    ],
    [
      [true, false, true].toString(),
      <AudioMuteIndicator isAudioMuted={isAudioMuted} />,
    ],
    [
      [true, true, false].toString(),
      <AudioLevelIndicator
        type={audioLevelDisplayType}
        level={audioLevel as number}
      />,
    ],
    [
      [false, true, false].toString(),
      <AudioLevelIndicator
        type={audioLevelDisplayType}
        level={audioLevel as number}
      />,
    ],
  ]);

  return (
    <div
      className={`${combinedClasses?.root} ${
        showGradient ? combinedClasses?.rootGradient : ''
      }`}
    >
      <div className={`${combinedClasses?.labelContainer}`}>
        <div
          className={` ${allowRemoteMute ? combinedClasses?.hoverHide : ''}`}
        >
          {audioStatusMap.get(
            [showAudioMuteStatus, showAudioLevel, isAudioMuted].toString(),
          )}
        </div>
        <div className={`${combinedClasses?.label}`}>{label}</div>
      </div>
      {allowRemoteMute && (
        <div className={`${combinedClasses?.controls}`}>
          <AudioMuteButton isAudioMuted={isAudioMuted} />
        </div>
      )}
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
