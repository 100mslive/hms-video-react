import React from 'react';
import { EventEmitter } from 'events';
import { AudioLevelDisplayType } from '../../types';
import { DisplayShapes } from '../Video';
import InlineCircle from './InlineCircle';
import InlineWave from './InlineWave';
import { AudioLevelBorder, AudioLevelIndicatorClasses } from './Border';
import { useHMSStore } from '../../hooks/HMSRoomProvider';
import { selectPeerAudioByID, selectPeerByID } from '../../store/selectors';

export interface AudioLevelIndicatorProps {
  peerId?: string;
  type: AudioLevelDisplayType;
  level?: number;
  color?: string;
  displayShape?: DisplayShapes;
  classes?: AudioLevelIndicatorClasses;
}

export const AudioLevelIndicator = ({
  peerId,
  type,
  level = 0,
  color,
  displayShape = 'rectangle',
  classes,
}: AudioLevelIndicatorProps) => {

  const audioLevel = useHMSStore((store) => selectPeerAudioByID(store, peerId));

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
