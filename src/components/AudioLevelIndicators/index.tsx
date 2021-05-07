import React from 'react';
import { AudioLevelDisplayType } from '../../types';
import { DisplayShapes } from '../Video';
import InlineCircle from './InlineCircle';
import InlineWave from './InlineWave';
import { AudioLevelBorder } from './Border';
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';
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
  type: AudioLevelDisplayType;
  level: number;
  color?: string;
  displayShape?: DisplayShapes;
  classes?: AudioLevelIndicatorClasses;
  defaultClasses?: AudioLevelIndicatorClasses;
}

const StyledAudioLevelIndicator = ({
  type,
  level,
  color,
  displayShape = 'rectangle',
  classes: extraClasses,
  defaultClasses,
}: StyledAudioLevelIndicatorProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  switch (type) {
    case 'inline-circle':
      return <InlineCircle level={level} />;
    case 'inline-wave':
      return <InlineWave level={level} />;
    case 'border':
      return (
        <AudioLevelBorder
          level={level}
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
