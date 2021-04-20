import React, { useState } from 'react';
import { Attachment, People } from '../../icons';
import { Peer } from '../../types';
import './index.css';
import { AttachmentButton, CloseButton } from '../MediaIcons';

interface Message {
  message: string;
  sender?: Peer;
  timeSent: string;
  notification?: boolean;
  direction?: 'left' | 'right' | 'center';
}
export interface ChatProps {
  messages: Message[];
  onSend: (message: string) => void;
}

export const Chat = ({ messages, onSend }: ChatProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = React.createRef<HTMLDivElement>();
  const scrollToBottom = () => {
    messagesEndRef.current!.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full ">
      <div className="bg-gray-200 rounded-t-2xl p-3 text-gray-500 flex flex-col justify-center items-center">
        <div className="w-8 h-1 rounded bg-gray-400 m-2"></div>
        <div className=" flex w-full justify-between">
          <div className="text-gray-500">
            <span>{People}</span> Everyone
          </div>
          <div>
            <CloseButton />
          </div>
        </div>
      </div>
      <div className="bg-gray-100 w-full h-full p-3 text-gray-500 overflow-y-auto no-scrollbar">
        <div className="py-3">
          <div className="flex justify-between text-gray-400">
            <span>Ivy L joined the room</span>
            <span className="text-xs">1 min ago </span>
          </div>
        </div>
        <div className="py-3">
          <div className="flex justify-between">
            <span>Nikhil</span>
            <span className="text-xs">1 min ago </span>
          </div>
          <div className="flex justify-between text-white leading-5 ">
            This is our first message
          </div>
        </div>

        {messages.map(message => {
          return message.notification ? (
            <div className="py-3">
              <div className="flex justify-between text-gray-400">
                <span>Ivy L joined the room</span>
                <span className="text-xs">1 min ago </span>
              </div>
            </div>
          ) : (
            <div className="py-3">
              <div className="flex justify-between">
                <span>{message.sender!.displayName}</span>
                <span className="text-xs">{message.timeSent} </span>
              </div>
              <div className="flex justify-between text-white leading-5 ">
                {message.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-200 h-11 rounded-b-2xl flex w-full justify-between p-3">
        <input
          className="bg-gray-200 placeholder-gray-500 text-white focus:outline-none leading-5 resize-y"
          placeholder="Write something here"
          value={message}
          onChange={event => {
            setMessage(event.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            onSend(message);
            setMessage('');
            scrollToBottom();
          }}
        >
          {Attachment}
        </button>
      </div>
    </div>
  );
};
