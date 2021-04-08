import React from 'react';
import InlineCircle from './InlineCircle';
import InlineWave from './InlineWave';

interface AudioLevelProps {
  audioLevelDisplayType: 'inline-wave' | 'inline-circle';
  level: number;
}

export default function AudioLevelIndicators({
  audioLevelDisplayType,
  level,
}: AudioLevelProps) {
  if (audioLevelDisplayType === 'inline-circle')
    return <InlineCircle level={level} />;
  else return <InlineWave level={level} />;
}
