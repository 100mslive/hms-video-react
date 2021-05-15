import React, { createContext, useContext, useEffect, useState } from 'react';
import { HMSPeerUpdate } from '@100mslive/100ms-web-sdk';
import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import HMSSpeaker from '@100mslive/100ms-web-sdk/dist/interfaces/speaker';
import sdkEventEmitter from './helpers/event-emitter';
import { areSpeakersApproxEqual } from './helpers/audioUtils';
import HMSLogger from '../utils/ui-logger';

interface SpeakerProviderProps {
  speakers: HMSSpeaker[];
  dominantSpeaker: HMSPeer | null;
}

const SpeakerContext = createContext<SpeakerProviderProps | null>(null);

export const SpeakerProvider: React.FC = props => {
  const [dominantSpeaker, setDominantSpeaker] = useState<HMSPeer | null>(null);
  const [speakers, setSpeakers] = useState<HMSSpeaker[]>([]);

  useEffect(() => {
    sdkEventEmitter.on('audio-level-update', updateSpeakers);
    sdkEventEmitter.on('peer-update', updateDominantSpeaker);
    return () => {
      sdkEventEmitter.off('audio-level-update', updateSpeakers);
      sdkEventEmitter.off('peer-update', updateDominantSpeaker);
    };
  }, []);

  const updateSpeakers = (newSpeakers: HMSSpeaker[]) => {
    HMSLogger.d('Listener [onAudioLevelUpdate]: ', newSpeakers);
    setSpeakers(oldSpeakers => {
      return areSpeakersApproxEqual(oldSpeakers, newSpeakers) ? oldSpeakers : newSpeakers;
    })
  };

  const updateDominantSpeaker = (type: HMSPeerUpdate, peer: HMSPeer | null) => {
    if (type === HMSPeerUpdate.BECAME_DOMINANT_SPEAKER) {
      setDominantSpeaker(peer);
    }
    if (type === HMSPeerUpdate.RESIGNED_DOMINANT_SPEAKER) {
      setDominantSpeaker(null);
    }
  };

  return (
    <SpeakerContext.Provider
      value={{
        speakers,
        dominantSpeaker,
      }}
    >
      {props.children}
    </SpeakerContext.Provider>
  );
};

export const useHMSSpeaker = (): SpeakerProviderProps => {
  const SpeakerContextConsumer = useContext(SpeakerContext);

  if (SpeakerContextConsumer === null) {
    throw new Error('Speaker Context not initialised!');
  }

  return SpeakerContextConsumer;
};
