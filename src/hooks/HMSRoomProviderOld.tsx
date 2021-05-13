import { HMSSdk } from '@100mslive/100ms-web-sdk';
import HMSConfig from '@100mslive/100ms-web-sdk/dist/interfaces/config';
import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import HMSMessage from '@100mslive/100ms-web-sdk/dist/interfaces/message';
import HMSUpdateListener from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import React, { createContext, useContext, useState } from 'react';
import { Silence } from '../components/Silence';
import HMSLogger from '../utils/ui-logger';
import sdkEventEmitter from './helpers/event-emitter';
import HMSRoomProps from './interfaces/HMSRoomProps';

const sdk = new HMSSdk();

const HMSContext = createContext<HMSRoomProps | null>(null);

export const HMSRoomProvider: React.FC = props => {
  const [peers, setPeers] = useState([] as HMSPeer[]);

  const [localPeer, setLocalPeer] = useState({} as HMSPeer);

  const [isScreenShare, setIsScreenShare] = useState(false);

  const [messages, setMessages] = useState<HMSMessage[]>([]);

  const [dominantSpeaker, setDominantSpeaker] = useState<
    HMSRoomProps['dominantSpeaker']
  >(null);

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
  };

  const leave = () => sdk.leave();

  const toggleMute = async (type: 'audio' | 'video') => {
    if (localPeer && localPeer.audioTrack && type === 'audio') {
      await localPeer.audioTrack.setEnabled(!localPeer.audioTrack.enabled);
    }
    if (localPeer && localPeer.videoTrack && type === 'video') {
      await localPeer.videoTrack.setEnabled(!localPeer.videoTrack.enabled);
    }
    setLocalPeer(sdk.getLocalPeer());
    setPeers(sdk.getPeers());
  };

  const toggleScreenShare = async () => {
    if (!isScreenShare) {
      HMSLogger.d('[toggleScreenshare]', 'Starting Screenshare');
      setIsScreenShare(true);
      await sdk.startScreenShare(() => {
        setIsScreenShare(false);
        setPeers(sdk.getPeers());
        setLocalPeer(sdk.getLocalPeer());
      });
    } else {
      HMSLogger.d('[toggleScreenshare]', 'Stopping Screenshare');
      setIsScreenShare(false);
      await sdk.stopScreenShare();
    }

    setPeers(sdk.getPeers());
    setLocalPeer(sdk.getLocalPeer());
  };

  const receiveMessage = (message: HMSMessage) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const sendMessage = (message: string) => {
    const hmsMessage = sdk.sendMessage('chat', message);
    receiveMessage({ ...hmsMessage, sender: 'You' });
    HMSLogger.d('[sendMessage]', message);
  };

  window.onunload = () => {
    leave();
  };

  return (
    <HMSContext.Provider
      value={{
        sdk,
        peers: peers,
        localPeer: localPeer,
        messages: messages.map(message => ({
          message: message.message,
          time: message.time,
          sender: message.sender,
        })),
        audioMuted: localPeer.audioTrack?.enabled as boolean,
        videoMuted: localPeer.videoTrack?.enabled as boolean,
        dominantSpeaker,
        join: join,
        leave: leave,
        toggleMute: toggleMute,
        toggleScreenShare: toggleScreenShare,
        sendMessage: sendMessage,
      }}
    >
      <Silence />
      {props.children}
    </HMSContext.Provider>
  );
};

export const useHMSRoom = (): HMSRoomProps => {
  const HMSContextConsumer = useContext(HMSContext);

  if (HMSContextConsumer === null) {
    throw new Error('HMSContext state variables are not set');
  }

  return HMSContextConsumer;
};
