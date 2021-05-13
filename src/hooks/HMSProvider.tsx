import { HMSSdk } from '@100mslive/100ms-web-sdk';
import HMSConfig from '@100mslive/100ms-web-sdk/dist/interfaces/config';
import HMSUpdateListener from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import React, { createContext, useContext } from 'react';
import sdkEventEmitter from './helpers/event-emitter';
import { MessageProvider } from './MessageProvider';
import { SpeakerProvider } from './SpeakerProvider';

interface HMSProviderProps {
  sdk: HMSSdk;
  join: (config: HMSConfig, listener: HMSUpdateListener) => void;
  leave: () => void;
}

const sdk = new HMSSdk();

const HMSContext = createContext<HMSProviderProps | null>(null);

export const HMSProvider: React.FC = props => {
  const join = (config: HMSConfig, listener: HMSUpdateListener) => {
    sdk.join(config, {
      onJoin: room => {
        sdkEventEmitter.emit('join', room);
        listener.onJoin(room);
      },
      onRoomUpdate: (type, room) => {
        sdkEventEmitter.emit('room-update', type, room);
        listener.onRoomUpdate(type, room);
      },
      onPeerUpdate: (type, peer) => {
        sdkEventEmitter.emit('peer-update', type, peer);
        listener.onPeerUpdate(type, peer);
      },
      onTrackUpdate: (type, track, peer) => {
        sdkEventEmitter.emit('track-update', type, track, peer);
        listener.onTrackUpdate(type, track, peer);
      },
      onMessageReceived: message => {
        sdkEventEmitter.emit('message-received', message);
        listener.onMessageReceived(message);
      },
      onError: exception => {
        sdkEventEmitter.emit('error', exception);
        listener.onError(exception);
      },
    });

    sdk.addAudioListener({
      onAudioLevelUpdate: speakers =>
        sdkEventEmitter.emit('audio-level-update', speakers),
    });
  };

  const leave = () => sdk.leave();

  window.onunload = () => {
    leave();
  };

  return (
    <HMSContext.Provider
      value={{
        sdk,
        join: join,
        leave: leave,
      }}
    >
      <MessageProvider>
        <SpeakerProvider>{props.children}</SpeakerProvider>
      </MessageProvider>
    </HMSContext.Provider>
  );
};

export const useHMS = (): HMSProviderProps => {
  const HMSContextConsumer = useContext(HMSContext);

  if (HMSContextConsumer === null) {
    throw new Error('HMSContext state variables are not set');
  }

  return HMSContextConsumer;
};
