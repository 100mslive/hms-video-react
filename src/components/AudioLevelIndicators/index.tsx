import React from 'react';
import { AudioLevelDisplayType } from '../../types';
import { DisplayShapes } from '../Video';
import InlineCircle from './InlineCircle';
import InlineWave from './InlineWave';
import AudioLevelBorder from './Border';
//@ts-ignore
import {apply, CSSRules, Directive} from 'twind';

export interface AudioLevelIndicatorProps {
  type: AudioLevelDisplayType;
  level: number;
  color?: string;
  displayShape?: DisplayShapes;
  classes?: {
    /**
     * Style attached to avatar
     */
    root?: Directive<CSSRules>;
    /**
     * Style attached when display shape is circle
     */
    videoCircle?: Directive<CSSRules>;
  };
}

export const AudioLevelIndicator = ({
  type,
  level,
  color,
  displayShape = 'rectangle',
  classes = {
    root: apply`w-full h-full absolute left-0 top-0 rounded-lg`,
    videoCircle: apply`rounded-full`,
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
