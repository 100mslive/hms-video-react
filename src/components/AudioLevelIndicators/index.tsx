import React from 'react';
import { AudioLevelDisplayType } from '../../types';
import InlineCircle from './InlineCircle';
import InlineWave from './InlineWave';

interface AudioLevelIndicatorProps {
  type: AudioLevelDisplayType;
  level: number;
}

export const AudioLevelIndicator = ({
  type,
  level,
}: AudioLevelIndicatorProps) => {
  switch (type) {
    case 'inline-circle':
      return <InlineCircle level={level} />;
      break;
    case 'inline-wave':
      return <InlineWave level={level} />;
      break;
    default:
      return null;
  }
};
