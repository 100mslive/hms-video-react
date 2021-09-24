import React from 'react';
import { selectTrackAudioByID } from '@100mslive/hms-video-store';
import { AudioLevelDisplayType } from '../../types';
import { DisplayShapes } from '../Video/Video';
import InlineCircle from './InlineCircle';
import InlineWave from './InlineWave';
import { AudioLevelBorder, AudioLevelIndicatorClasses } from './Border';
import { useHMSStore } from '../../hooks/HMSRoomProvider';

export interface AudioLevelIndicatorProps {
  audioTrackId?: string;
  type: AudioLevelDisplayType;
  level?: number;
  color?: string;
  displayShape?: DisplayShapes;
  classes?: AudioLevelIndicatorClasses;
}

export const AudioLevelIndicator = ({
  audioTrackId,
  type,
  level = 0,
  color,
  displayShape = 'rectangle',
  classes,
}: AudioLevelIndicatorProps) => {
  let audioLevel = useHMSStore(selectTrackAudioByID(audioTrackId));
  audioLevel = level || audioLevel;

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
          classes={classes}
        />
      );
    default:
      return null;
  }
};
