import React from 'react';
import { AudioLevelDisplayType } from '../../types';
import { AudioLevelIndicator } from '../AudioLevelIndicators/index';
import { AudioMuteIndicator, AudioMuteButton } from '../MediaIcons';
import './index.css';

export interface BottomControlsProps {
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
    controlStatus?: string;
    label?: string;
    controls?: string;
  };
}

export const BottomControls = ({
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
}: BottomControlsProps) => {
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
      className={`bottom-controls-container pb-2 text-white px-2 ${classes?.root}`}
      style={!showGradient ? { background: 'none' } : {}}
    >
      <div>
        <div
          className={`bottom-controls-status ${
            allowRemoteMute ? 'hover-hide' : ''
          } ${classes?.controlStatus}`}
        >
          {audioStatusMap.get(
            [showAudioMuteStatus, showAudioLevel, isAudioMuted].toString()
          )}
        </div>
        <div className={`mt-1 ${classes?.label}`}>{label}</div>
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
