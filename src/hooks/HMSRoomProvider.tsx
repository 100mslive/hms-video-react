import React, { useState, useContext, createContext } from 'react';
import { HMSSdk } from '@100mslive/100ms-web-sdk';
import HMSUpdateListener from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import HMSConfig from '@100mslive/100ms-web-sdk/dist/interfaces/config';
import HMSRoomProps from './interfaces/HMSRoomProps';
import createListener from './helpers/createListener';
import HMSMessage from '@100mslive/100ms-web-sdk/dist/interfaces/message';
import { Silence } from '../components/Silence';
import { useEffect } from 'react';
import { HMSMessageType } from '@100mslive/100ms-web-sdk/dist/sdk/models/enums/HMSMessageType';
import Message from '@100mslive/100ms-web-sdk/dist/sdk/models/HMSMessage';

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
  const [audioMuted, setAudioMuted] = useState(false);

  const [videoMuted, setVideoMuted] = useState(false);

  useEffect(() => {
    if (audioMuted) {
      toggleMuteInPeer('audio');
    }
    if (videoMuted) {
      toggleMuteInPeer('video');
    }
  }, [localPeer]);

  const join = (config: HMSConfig, listener: HMSUpdateListener) => {
    sdk.join(
      config,
      createListener(listener, setPeers, setLocalPeer, receiveMessage, sdk),
    );
  };

  const leave = () => {
    //TODO this is not strictly necessary since SDK should clean up, but foing it for safety
    setPeers([]);
    setAudioMuted(false);
    setVideoMuted(false);
    sdk.leave();
  };

  const toggleMute = (type: 'audio' | 'video') => {
    if (type === 'audio') {
      setAudioMuted(prevMuted => !prevMuted);
    } else if (type === 'video') {
      setVideoMuted(prevMuted => !prevMuted);
    }

    toggleMuteInPeer(type);
  };

  const toggleMuteInPeer = async (type: 'audio' | 'video') => {
    if (localPeer && localPeer.audioTrack && type === 'audio') {
      await localPeer.audioTrack.setEnabled(!localPeer.audioTrack.enabled);
    }
    if (localPeer && localPeer.videoTrack && type === 'video') {
      await localPeer.videoTrack.setEnabled(!localPeer.videoTrack.enabled);
    }

    setPeers(sdk.getPeers());
    setLocalPeer(sdk.getLocalPeer());
  };

  const toggleScreenShare = async () => {
    if (!isScreenShare) {
      console.debug(
        'HMSui-component: [toggleScreenshare] Starting screenshare',
      );
      setIsScreenShare(true);
      await sdk.startScreenShare(() => {
        console.debug(
          'HMSui-component: [toggleScreenshare] Inside the onstop of screenshare',
        );
        setIsScreenShare(false);
        //await sdk.stopScreenShare();
        setPeers(sdk.getPeers());
        setLocalPeer(sdk.getLocalPeer());
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
    let hmsMessage = {
      sender: sdk.getLocalPeer().name,
      receiver: '',
      message: message,
      type: HMSMessageType.CHAT,
      time: new Date(),
    };
    sdk.sendMessage('chat', message);
    receiveMessage({ ...hmsMessage, sender: 'You' });
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
        messages: messages.map(message => ({
          message: message.message,
          timeSent: 'now',
          sender: message.sender,
        })),
        audioMuted: audioMuted,
        videoMuted: videoMuted,
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
