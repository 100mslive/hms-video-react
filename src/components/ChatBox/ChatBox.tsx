import React, { useEffect, useState } from 'react';
import { CloseIcon, PeopleIcon, SendIcon } from '../../icons';
import './index.css';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Autolinker from 'autolinker';
import ReactHtmlParser from 'react-html-parser';
import { withClasses } from '../../utils/styles';

//@ts-ignore
import { create } from 'twind';
import { combineClasses } from '../../utils';
interface ChatBoxClasses {
  root?: string;
  header?: string;
  headerLine?: string;
  headerRoot?: string;
  headerText?: string;
  headerCloseButton?: string;
  messageBox?: string;
  messageRoot?: string;
  messageInfo?: string;
  messageSender?: string;
  messageTime?: string;
  messageText?: string;
  notificationRoot?: string;
  notificationInfo?: string;
  notificationText?: string;
  notificationTime?: string;
  noMessageRoot?: string;
  footer?: string;
  chatInput?: string;
  sendButton?: string;
}

const defaultClasses: ChatBoxClasses = {
  root: 'w-full h-full  rounded-2xl flex flex-col shadow-sm',
  header: `bg-white dark:bg-gray-200 rounded-t-2xl p-3 text-gray-300 dark:text-gray-500 flex flex-col justify-center items-center shadow border-b-1 border-gray-500`,
  headerLine: 'w-8 h-1 rounded bg-white dark:bg-gray-400 m-2',
  headerRoot: 'flex w-full justify-between',
  headerText: 'text-gray-300 dark:text-gray-500 flex',
  headerCloseButton: 'focus:outline-none',
  messageBox:
    'bg-white dark:bg-gray-100 w-full h-full p-3 text-gray-300 dark:text-gray-500 overflow-y-auto no-scrollbar flex-grow',
  messageRoot: 'py-3',
  messageInfo: 'flex justify-between',
  messageTime: 'text-xs',
  messageText: 'text-gray-100 dark:text-white leading-5 max-w-full break-words',
  noMessageRoot:
    'flex justify-center items-center text-gray-300 dark:text-gray-400 h-full',
  footer:
    'bg-white dark:bg-gray-200 min-h-11 rounded-b-2xl flex w-full justify-between p-3 border-t-1 border-gray-500',
  chatInput:
    'bg-white dark:bg-gray-200 placeholder-gray-500 text-gray-100 dark:text-white focus:outline-none leading-5 overflow-y-auto no-scrollbar resize-none w-5/6',
  sendButton: 'focus:outline-none',
  notificationRoot: 'py-3',
  notificationInfo: 'flex justify-between text-gray-300 dark:text-gray-400',
  notificationTime: 'text-xs',
};

export interface Message {
  message: string;
  sender?: string;
  time: Date;
  notification?: boolean;
  direction?: 'left' | 'right' | 'center';
}
interface StyledChatProps {
  messages: Message[];
  onSend: (message: string) => void;
  onClose?: () => void;

  willScrollToBottom?: boolean;
  scrollAnimation?: 'smooth' | 'auto';
  messageFormatter?: (message: string) => React.ReactNode;

  /**
   * default classes
   */
  defaultClasses?: ChatBoxClasses;

  /**
   * extra classes added  by user
   */
  classes?: ChatBoxClasses;
  timeFormatter?: (date: Date) => string;
}

export const StyledChatBox = ({
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
  classes: extraClasses,
  defaultClasses,
  timeFormatter = (date: Date) => {
    return `${date.getHours()}:${date.getMinutes()}`;
  },
}: StyledChatProps) => {
  //@ts-expect-error

  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [message, setMessage] = useState('');

  const messagesEndRef = React.createRef<HTMLDivElement>();
  const scrollToBottom = () => {
    messagesEndRef.current!.scrollIntoView({
      behavior: scrollAnimation,
    });
  };
  useEffect(() => {
    if (willScrollToBottom) {
      scrollToBottom();
    }
  }, [message]);

  return (
    <React.Fragment>
      {/* root */}
      <div className={combinedClasses?.root}>
        {/* header */}
        <div className={combinedClasses?.header}>
          {/* header-line */}
          <div className={combinedClasses?.headerLine}></div>
          {/* header-root */}
          <div className={combinedClasses?.headerRoot}>
            {/* header-text */}
            <div className={combinedClasses?.headerText}>
              <span><PeopleIcon/></span> Everyone
            </div>
            <div>
              {/* headerCloseButton */}
              <button
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
                className={combinedClasses?.headerCloseButton}
              >
                <CloseIcon/>
              </button>
            </div>
          </div>
        </div>
        {/* messageBox */}
        {/* TODO: move no scroll bar css logic to tailwind */}
        <div className={`${combinedClasses?.messageBox} no-scrollbar`}>
          {messages.map(message => {
            return message.notification ? (
              /* notificationRoot */
              <div className={combinedClasses?.notificationRoot}>
                {/* notificationInfo*/}
                <div className={combinedClasses?.notificationInfo}>
                  {/*notificationText*/}
                  <span className={combinedClasses?.notificationText}>
                    {messageFormatter
                      ? messageFormatter(message.message)
                      : message.message}
                  </span>
                  <span className={combinedClasses?.time}>
                    {timeFormatter(message.time)}
                  </span>
                </div>
              </div>
            ) : (
              /* messageRoot */
              <div className={combinedClasses?.messageRoot}>
                {/* messageInfo */}
                <div className={combinedClasses?.messageInfo}>
                  {/* messageSender */}
                  <span className={combinedClasses?.messageSender}>
                    {message.sender}
                  </span>
                  {/* messageTime */}
                  <span className={combinedClasses?.messageTime}>
                    {timeFormatter(message.time)}
                  </span>
                </div>
                {/* messageText */}
                <div className={combinedClasses?.messageText}>
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
            /* NoMessageRoot */
            <div className={combinedClasses?.noMessageRoot}>
              There are no messages here.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* footer */}
        <div className={combinedClasses?.footer}>
          {/* chatInput */}
          {/* TODO: move no scrollbar logic to tailwind */}
          <TextareaAutosize
            rowsMax={3}
            className={`${combinedClasses?.chatInput} no-scrollbar`}
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
          {/* sendButton */}
          <button
            className={combinedClasses?.sendButton}
            onClick={() => {
              onSend(message);
              setMessage('');
            }}
          >
            <SendIcon className="text-white"/>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export type ChatProps = Omit<StyledChatProps, 'defaultClasses'>;

export const ChatBox = withClasses<ChatBoxClasses | undefined>(
  defaultClasses,
  'chatBox',
)<StyledChatProps>(StyledChatBox);
