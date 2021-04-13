import React from 'react';
import { AudioLevelDisplayType } from '../../../types';
import { AudioLevelIndicator } from '../../AudioLevelIndicators/index';
import { AudioMuteIndicator, AudioMuteButton } from '../../MediaIcons';
import '../index.css';

export interface VideoTileControlsProps {
  label?: string;
  isAudioMuted?: boolean;
  showGradient?: boolean;
  showAudioMuteStatus?: boolean;
  allowRemoteMute?: boolean;
  showAudioLevel?: boolean;
  audioLevelDisplayType?: AudioLevelDisplayType;
  audioLevel?: number;
  classes?: {
    root?: string;
    labelContainer?: string;
    controls?: string;
  };
}

export const VideoTileControls = ({
  label = '',
  isAudioMuted = false,
  showGradient = true,
  showAudioMuteStatus = true,
  allowRemoteMute = false,
  showAudioLevel = false,
  audioLevelDisplayType = 'inline-wave',
  audioLevel,
  classes = {
    root: 'text-center rounded-lg',
  },
}: VideoTileControlsProps) => {
  // Map [showAudioMuteStatus, showAudioLevel, isAudioMuted] to audio status - actual element to render.
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
      className={`bottom-controls-container absolute bottom-0 w-full pb-2 text-white px-2 ${classes?.root}`}
      style={!showGradient ? { background: 'none' } : {}}
    >
      <div className={`${classes.labelContainer}`}>
        <div
          className={`bottom-controls-status mx-1 ${
            allowRemoteMute ? 'hover-hide' : ''
          }`}
        >
          {audioStatusMap.get(
            [showAudioMuteStatus, showAudioLevel, isAudioMuted].toString()
          )}
        </div>
        <div className={`mt-1 mx-1`}>{label}</div>
      </div>
      {allowRemoteMute && (
        <div
          className={`bottom-controls text-center mt-1 ${classes?.controls}`}
        >
          <AudioMuteButton isAudioMuted={isAudioMuted} />
        </div>
      )}
    </div>
  );
};
