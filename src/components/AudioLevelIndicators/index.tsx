import React, { useState } from 'react';
import { AudioLevelDisplayType } from '../../types';
import { DisplayShapes } from '../Video';
import InlineCircle from './InlineCircle';
import InlineWave from './InlineWave';
import { AudioLevelBorder } from './Border';
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';
import { audioLevelEmitter } from '../../hooks/SpeakerProvider';
import HMSSpeaker from '@100mslive/100ms-web-sdk/dist/interfaces/speaker';

export interface AudioLevelIndicatorClasses {
  /**
   * Style attached to avatar
   */
  root?: string;
  /**
   * Style attached when display shape is circle
   */
  videoCircle?: string;
}

const defaultClasses: AudioLevelIndicatorClasses = {
  root: 'w-full h-full absolute left-0 top-0 rounded-lg',
  videoCircle: 'rounded-full',
};
export interface StyledAudioLevelIndicatorProps {
  peerId?: string;
  type: AudioLevelDisplayType;
  isAudioMuted?: boolean;
  level?: number;
  color?: string;
  displayShape?: DisplayShapes;
  classes?: AudioLevelIndicatorClasses;
  defaultClasses?: AudioLevelIndicatorClasses;
}

const StyledAudioLevelIndicator = ({
  peerId,
  type,
  isAudioMuted = false,
  level = 0,
  color,
  displayShape = 'rectangle',
  classes: extraClasses,
  defaultClasses,
}: StyledAudioLevelIndicatorProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [peerAudioLevel, setPeerAudioLevel] = useState(0);
  if (peerId) {
    const handleAudioLevelUpdate = (speaker: HMSSpeaker) => {
      setPeerAudioLevel(speaker.audioLevel);
    };
    audioLevelEmitter.on(peerId, handleAudioLevelUpdate);
  }

  const audioLevel = Number(!isAudioMuted && (peerAudioLevel || level));

  switch (type) {
    case 'inline-circle':
      return <InlineCircle level={audioLevel} />;
    case 'inline-wave':
      return <InlineWave level={audioLevel} />;
    case 'border':
      return (
        <AudioLevelBorder
          level={audioLevel}
          displayShape={displayShape}
          color={color}
          classes={combinedClasses}
        />
      );
    default:
      return null;
  }
};

export type AudioLevelIndicatorProps = Omit<
  StyledAudioLevelIndicatorProps,
  'defaultClasses'
>;

export const AudioLevelIndicator = withClasses<
  AudioLevelIndicatorClasses | undefined
>(
  defaultClasses,
  'audioLevelIndicator',
)<StyledAudioLevelIndicatorProps>(StyledAudioLevelIndicator);
