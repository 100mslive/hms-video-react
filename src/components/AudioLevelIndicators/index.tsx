import React, { useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import { AudioLevelDisplayType } from '../../types';
import { DisplayShapes } from '../Video';
import InlineCircle from './InlineCircle';
import InlineWave from './InlineWave';
import { AudioLevelBorder, AudioLevelIndicatorClasses } from './Border';
import HMSSpeaker from '@100mslive/100ms-web-sdk/dist/interfaces/speaker';


export interface AudioLevelIndicatorProps {
  peerId?: string;
  audioLevelEmitter?: EventEmitter;
  type: AudioLevelDisplayType;
  isAudioMuted?: boolean;
  level?: number;
  color?: string;
  displayShape?: DisplayShapes;
  classes?: AudioLevelIndicatorClasses;
}

export const AudioLevelIndicator = ({
  peerId,
  audioLevelEmitter,
  type,
  isAudioMuted = false,
  level = 0,
  color,
  displayShape = 'rectangle',
  classes,
}: AudioLevelIndicatorProps) => {
  const [peerAudioLevel, setPeerAudioLevel] = useState(0);
  useEffect(() => {
    const handleAudioLevelUpdate = (speaker: HMSSpeaker) => {
      setPeerAudioLevel(speaker.audioLevel);
    };
    peerId && audioLevelEmitter?.on(peerId, handleAudioLevelUpdate);
    return () => {
      peerId && audioLevelEmitter?.off(peerId, handleAudioLevelUpdate);
    };
  }, [peerId]);

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
          classes={classes}
        />
      );
    default:
      return null;
  }
};
