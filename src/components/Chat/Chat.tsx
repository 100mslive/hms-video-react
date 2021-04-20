import React from 'react';
import { People } from '../../icons';
import { Peer } from '../../types';
import { AttachmentButton, CloseButton } from '../MediaIcons';

interface Message {
  message: string;
  sender: Peer;
  timeSent: string;
  notification?: boolean;
  direction?: 'left' | 'right' | 'center';
}
export interface ChatProps {
  messages: Message[];
  onSend: (message: string) => {};
}

export const Chat = ({ messages, onSend }: ChatProps) => {
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
      <div className="bg-gray-100">Messages</div>
      <div className="bg-gray-200 h-11 rounded-b-2xl">
        <input
          className="bg-gray-200 placeholder-gray-500 text-white"
          placeholder="Write something here"
        ></input>
        <AttachmentButton />
      </div>
    </div>
  );
};
