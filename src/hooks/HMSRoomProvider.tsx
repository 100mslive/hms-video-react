import React, { useState, useContext, createContext } from 'react';
import { HMSSdk } from '@100mslive/100ms-web-sdk';
import HMSUpdateListener from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import HMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';
import HMSConfig from '@100mslive/100ms-web-sdk/dist/interfaces/config';
import HMSRoomProps from './interfaces/HMSRoomProps';
import createListener from './helpers/createListener';
import HMSMessage from '@100mslive/100ms-web-sdk/dist/interfaces/message';

const sdk = new HMSSdk();

const HMSContext = createContext<HMSRoomProps | null>(null);

export const HMSRoomProvider: React.FC = props => {
  const [peers, setPeers] = useState(sdk.getPeers());

  const [localPeer, setLocalPeer] = useState(sdk.getLocalPeer());

  const [isScreenShare, setIsScreenShare] = useState(false);

  const [messages, setMessages] = useState<HMSMessage[]>([]);

  const receiveMessage = (message: HMSMessage) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const join = (config: HMSConfig, listener: HMSUpdateListener) => {
    sdk.join(
      config,
      createListener(listener, setPeers, setLocalPeer, receiveMessage, sdk),
    );
  };

  const leave = () => {
    //TODO this is not strictly necessary since SDK should clean up, but foing it for safety
    setPeers([]);
    sdk.leave();
  };

  const toggleMute = async (track: HMSTrack) => {
    await track.setEnabled(!track.enabled);
    setPeers(sdk.getPeers());
    setLocalPeer(sdk.getLocalPeer());
  };

  const toggleScreenShare = async () => {
    if (!isScreenShare) {
      console.debug(
        'HMSui-component: [toggleScreenshare] Starting screenshare',
      );
      setIsScreenShare(true);
      await sdk.startScreenShare(async () => {
        console.debug(
          'HMSui-component: [toggleScreenshare] Inside the onstop of screenshare',
        );
        setIsScreenShare(false);
        await sdk.stopScreenShare();
      });
    } else {
      console.debug('HMSui-component: [toggleScreenshare] Stopping screnshare');
      setIsScreenShare(false);
      await sdk.stopScreenShare();
    }

    setPeers(sdk.getPeers());
    setLocalPeer(sdk.getLocalPeer());
  };
  const sendMessage = (message: string) => {
    console.debug('HMSui-component: [senMessage] sendingMessage', message);
    sdk.sendMessage('chat', message);
    console.debug('HMSui-component: [senMessage] sentMessage', message);
  };

  window.onunload = () => {
    leave();
  };

  return (
    <HMSContext.Provider
      value={{
        peers: peers,
        localPeer: localPeer,
        messages: messages,
        join: join,
        leave: leave,
        toggleMute: toggleMute,
        toggleScreenShare: toggleScreenShare,
        sendMessage: sendMessage,
      }}
    >
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
