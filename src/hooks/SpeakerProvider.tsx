import React, { createContext, useContext, useEffect, useState } from 'react';
import { EventEmitter } from 'events';
import { HMSPeerUpdate } from '@100mslive/100ms-web-sdk';
import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import HMSSpeaker from '@100mslive/100ms-web-sdk/dist/interfaces/speaker';
import sdkEventEmitter from './helpers/event-emitter';
import { areSpeakersApproxEqual } from './helpers/audioUtils';
import HMSLogger from '../utils/ui-logger';
import { differenceWith } from 'lodash';

interface SpeakerProviderProps {
  dominantSpeaker: HMSPeer | null;
}

const SpeakerContext = createContext<SpeakerProviderProps | null>(null);

export const SpeakerProvider: React.FC = props => {
  const [dominantSpeaker, setDominantSpeaker] = useState<HMSPeer | null>(null);

  useEffect(() => {
    sdkEventEmitter.on('peer-update', updateDominantSpeaker);
    return () => {
      sdkEventEmitter.off('peer-update', updateDominantSpeaker);
    };
  }, []);

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

/** @internal */
class AudioLevelEmitter extends EventEmitter {
  private readonly sdk: EventEmitter;
  private speakers: HMSSpeaker[] = [];

  constructor(sdk: EventEmitter) {
    super();
    this.sdk = sdk;
    this.sdk.on('audio-level-update', this.dispatch);
  }

  emit(peerId: string, speaker: HMSSpeaker) {
    return super.emit(peerId, speaker);
  }

  /**
   * Emit audio level events.
   * @param newSpeakers New speakers received from SDK Audio Level Update.
   *
   * 'speakers' maintains previous speakers.
   *
   * Peer in newSpeakers -> Peer speaking - update audioLevel.
   * Peer in speakers and not in newSpeakers -> Peer stopped speaking - update audioLevel = 0.
   *
   */
  dispatch = (newSpeakers: HMSSpeaker[]) => {
    if (areSpeakersApproxEqual(this.speakers, newSpeakers)) {
      return;
    }

    newSpeakers.forEach(speaker => this.emit(speaker.peerId, speaker));

    const previousSpeakers = differenceWith(
      this.speakers,
      newSpeakers,
      (a, b) => a.peerId === b.peerId,
    );

    HMSLogger.d('AudioLevel Dispatch', { previousSpeakers, newSpeakers });

    previousSpeakers.forEach(speaker =>
      this.emit(speaker.peerId, { ...speaker, audioLevel: 0 }),
    );

    this.speakers = newSpeakers;
  };
}

export const audioLevelEmitter = new AudioLevelEmitter(sdkEventEmitter);
