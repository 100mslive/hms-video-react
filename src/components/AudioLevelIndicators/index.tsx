import React from 'react';
import { AudioLevelDisplayType } from '../../types';
import { DisplayShapes } from '../Video';
import InlineCircle from './InlineCircle';
import InlineWave from './InlineWave';
import AudioLevelBorder from './Border';

export interface AudioLevelIndicatorProps {
  type: AudioLevelDisplayType;
  level: number;
  color?: string;
  displayShape?: DisplayShapes;
  classes?: {
    /**
     * Style attached to avatar
     */
    root?: string;
    /**
     * Style attached when display shape is circle
     */
    videoCircle?: string;
  };
}

export const AudioLevelIndicator = ({
  type,
  level,
  color,
  displayShape = 'rectangle',
  classes = {
    root: 'w-full h-full absolute left-0 top-0 rounded-lg',
    videoCircle: 'rounded-full',
  },
}: AudioLevelIndicatorProps) => {
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
          classes={classes}
        />
      );
    default:
      return null;
  }
};
