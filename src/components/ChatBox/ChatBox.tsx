import React, { useEffect, useState } from 'react';
import { Attachment, Close, People, Send } from '../../icons';
import { Peer } from '../../types';
import './index.css';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { CloseButton } from '../MediaIcons';

import Autolinker from 'autolinker';
import ReactHtmlParser from 'react-html-parser';

export interface Message {
  message: string;
  sender?: Peer;
  timeSent: string;
  notification?: boolean;
  direction?: 'left' | 'right' | 'center';
}
export interface ChatProps {
  messages: Message[];
  onSend: (message: string) => void;
  onClose?: () => void;

  willScrollToBottom?: boolean;
  scrollAnimation?: 'smooth' | 'auto';
  messageFormatter?: (message: string) => React.ReactNode;
}

export const ChatBox = ({
  messages,
  onSend,
  onClose,

  willScrollToBottom = true,
  scrollAnimation = 'smooth',
  messageFormatter = (message: string) => {
    let text = Autolinker.link(message, {
      sanitizeHtml: true,
      mention: 'twitter',
      className: 'text-blue-tint',
    });

    return ReactHtmlParser(text);
  },
}: ChatProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = React.createRef<HTMLDivElement>();
  const scrollToBottom = () => {
    messagesEndRef.current!.scrollIntoView({ behavior: scrollAnimation });
  };
  useEffect(() => {
    if (willScrollToBottom) {
      scrollToBottom();
    }
  }, [message]);

  return (
    <React.Fragment>
      <div className="w-full h-full  rounded-2xl flex flex-col">
        <div className="bg-gray-200 rounded-t-2xl p-3 text-gray-500 flex flex-col justify-center items-center">
          <div className="w-8 h-1 rounded bg-gray-400 m-2"></div>
          <div className=" flex w-full justify-between">
            <div className="text-gray-500 flex">
              <span>{People}</span> Everyone
            </div>
            <div>
              <button
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
                className="focus:outline-none"
              >
                {Close}
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 w-full h-full p-3 text-gray-500 overflow-y-auto no-scrollbar flex-grow">
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
                <div className=" text-white leading-5 max-w-full break-words">
                  {/* {ReactHtmlParser(
                      Autolinker.link(message.message, { sanitizeHtml: true }),
                    )} */}
                  {/* <ReactMarkdown>{message.message}</ReactMarkdown> */}
                  {messageFormatter
                    ? messageFormatter(message.message)
                    : message.message}
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <div className="flex justify-center items-center text-gray-400 h-full">
              There are no messages here.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-gray-200 min-h-11 rounded-b-2xl flex w-full justify-between p-3 ">
          <TextareaAutosize
            rowsMax={3}
            className="bg-gray-200 placeholder-gray-500 text-white focus:outline-none leading-5 overflow-y-auto no-scrollbar resize-none w-5/6"
            placeholder="Write something here"
            value={message}
            onKeyPress={event => {
              if (event.key === 'Enter' && !event.shiftKey) {
                onSend(message);
                setMessage('');
                event.preventDefault();
              }
            }}
            onChange={event => {
              setMessage(event.target.value);
            }}
          />
          <button
            className="focus:outline-none"
            onClick={() => {
              onSend(message);
              setMessage('');
            }}
          >
            {Send}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
