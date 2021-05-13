import HMSSpeaker from '@100mslive/100ms-web-sdk/dist/interfaces/speaker';
import React, { createContext, useEffect, useState } from 'react';
import sdkEventEmitter from './helpers/event-emitter';

const HMSContext = createContext<{ speakers: HMSSpeaker[] } | null>(null);

export const HMSProvider: React.FC = props => {
  const [speakers, setSpeakers] = useState<HMSSpeaker[]>([]);

  useEffect(() => {
    sdkEventEmitter.on('audio-level-update', setSpeakers);
    return () => {
      sdkEventEmitter.off('audio-level-update', setSpeakers);
    };
  }, []);

  return (
    <HMSContext.Provider
      value={{
        speakers,
      }}
    >
      {props.children}
    </HMSContext.Provider>
  );
};
