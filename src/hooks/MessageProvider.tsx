import React, { createContext, useContext, useEffect, useState } from 'react';
import HMSMessage from '@100mslive/100ms-web-sdk/dist/interfaces/message';
import { Message } from '../components/ChatBox/ChatBox';
import sdkEventEmitter from './helpers/event-emitter';
import { useHMS } from './HMSProvider';

interface MessageProviderProps {
  messages: Message[];
  sendMessage: (message: string) => void;
}

const MessageContext = createContext<MessageProviderProps | null>(null);

export const MessageProvider: React.FC = props => {
  const { sdk } = useHMS();
  const [messages, setMessages] = useState<HMSMessage[]>([]);

  useEffect(() => {
    sdkEventEmitter.on('message-received', handleMessageReceived);
    return () => {
      sdkEventEmitter.off('message-received', handleMessageReceived);
    };
  }, []);

  const handleMessageReceived = (message: HMSMessage) => {
    const senderPeer = sdk
      .getPeers()
      .find(peer => peer.peerId === message.sender);
    const localPeer = sdk.getLocalPeer();
    receiveMessage({
      ...message,
      sender:
        localPeer.peerId === message.sender
          ? 'You'
          : senderPeer
          ? senderPeer.name
          : 'Unknown',
    });
  };

  const receiveMessage = (message: HMSMessage) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };

  const sendMessage = (message: string) => {
    const hmsMessage = sdk.sendMessage('chat', message);
    receiveMessage({ ...hmsMessage, sender: 'You' });
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        sendMessage,
      }}
    >
      {props.children}
    </MessageContext.Provider>
  );
};

export const useHMSMessage = (): MessageProviderProps => {
  const MessageContextConsumer = useContext(MessageContext);

  if (MessageContextConsumer === null) {
    throw new Error('Message Context not initialised!');
  }

  return MessageContextConsumer;
};
