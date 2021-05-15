import React, { useEffect, useRef, useState } from 'react';
import { CloseIcon, DownCaratIcon, PeopleIcon, SendIcon } from '../Icons';
import './index.css';
import Autolinker from 'autolinker';
import ReactHtmlParser from 'react-html-parser';
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';
import { Button } from '../Button';
import { useInView } from 'react-intersection-observer';

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
  unreadMessagesContainer?: string;
  unreadMessagesInner?: string;
  unreadIcon?: string;
}

const defaultClasses: ChatBoxClasses = {
  root: 'w-full h-full  rounded-2xl flex flex-col shadow-sm',
  header: `bg-white dark:bg-gray-200 rounded-t-2xl p-3 text-gray-300 dark:text-gray-500 flex flex-col justify-center items-center shadow border-b-1 border-gray-500`,
  headerLine: 'w-8 h-1 rounded bg-white dark:bg-gray-400 m-2',
  headerRoot: 'flex w-full justify-between',
  headerText: 'text-gray-300 dark:text-gray-500 flex items-center',
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
    'bg-white dark:bg-gray-200 min-h-11 rounded-b-2xl flex w-full justify-between p-3 border-t-1 border-gray-500 relative',
  chatInput:
    'bg-white dark:bg-gray-200 placeholder-gray-500 text-gray-100 dark:text-white focus:outline-none leading-5 overflow-y-auto no-scrollbar resize-none w-5/6',
  notificationRoot: 'py-3',
  notificationInfo: 'flex justify-between text-gray-300 dark:text-gray-400',
  notificationTime: 'text-xs',
  unreadMessagesContainer:
    'absolute left-0 p-1 w-full bottom-full flex justify-center',
  unreadMessagesInner:
    'rounded-md px-2 py-1 bg-brand-main text-white flex cursor-pointer items-center ',
  unreadIcon: 'ml-2 w-3 h-3',
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
  scrollAnimation?: ScrollBehavior;
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
  willScrollToBottom = true, //TODO shouldn't be exposed as a prop
  scrollAnimation = 'auto', //TODO shouldn't be exposed as a prop
  messageFormatter = (message: string) => {
    let text = Autolinker.link(message, {
      sanitizeHtml: true,
      mention: 'twitter',
      className: 'text-brand-tint',
    });

    return (
      <div className="whitespace-pre-wrap">{ReactHtmlParser(text.trim())}</div>
    );
  },
  classes: extraClasses,
  defaultClasses,
  timeFormatter = (date: Date) => {
    const min = date.getMinutes();
    const minString = min < 10 ? `0${min}` : min;
    return `${date.getHours()}:${minString}`;
  },
}: StyledChatProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [message, setMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [toScroll, setToScroll] = useState<ScrollBehavior | 'none'>('none');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const { ref: messagesEndRef, inView, entry } = useInView();
  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = ({
    behavior = 'auto',
  }: {
    behavior: ScrollBehavior;
  }) => {
    messagesRef.current!.scrollTo({
      top: messagesRef.current!.scrollHeight,
      behavior: behavior,
    });
  };

  useEffect(() => {
    if (localMessages.length > 0) {
      // TODO there should be instant chat sending locally. Chat hooks should go here
      if (
        willScrollToBottom &&
        (messagesRef.current!.scrollTop ===
          messagesRef.current!.scrollHeight -
            messagesRef.current!.clientHeight ||
          messages[messages.length - 1].sender === 'You')
      ) {
        setToScroll(scrollAnimation);
      } else {
        setUnreadMessagesCount(unreadMessagesCount => unreadMessagesCount + 1);
      }
    } else {
      setToScroll('auto');
    }
    setLocalMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (toScroll !== 'none') {
      scrollToBottom({ behavior: scrollAnimation });
      setToScroll('none');
      setUnreadMessagesCount(0);
    }
  }, [localMessages, toScroll]);

  useEffect(() => {
    if (inView) {
      setUnreadMessagesCount(0);
    }
  }, [inView]);

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
              <span>
                <PeopleIcon />
              </span>
              <span> Everyone</span>
            </div>
            <div>
              {/* headerCloseButton */}
              <Button
                variant={'icon-only'}
                size={'sm'}
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <CloseIcon />
              </Button>
              {/* <button
                onClick={() => {
                  if (onClose) {
                    onClose();
                  }
                }}
                className={combinedClasses?.headerCloseButton}
              >
                <CloseIcon />
              </button> */}
            </div>
          </div>
        </div>
        {/* messageBox */}
        {/* TODO: move no scroll bar css logic to tailwind */}
        <div
          className={`${combinedClasses?.messageBox} no-scrollbar`}
          ref={messagesRef}
        >
          {localMessages.map(message => {
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
          {localMessages.length === 0 && (
            /* NoMessageRoot */
            <div className={combinedClasses?.noMessageRoot}>
              There are no messages here.
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>
        {/* footer */}
        <div className={combinedClasses?.footer}>
          {unreadMessagesCount !== 0 && (
            <div className={combinedClasses?.unreadMessagesContainer}>
              <div
                className={combinedClasses?.unreadMessagesInner}
                onClick={() => {
                  scrollToBottom({ behavior: scrollAnimation });
                }}
              >
                {`New message${unreadMessagesCount > 1 ? 's' : ''}`}
                <DownCaratIcon className={combinedClasses?.unreadIcon} />
              </div>
            </div>
          )}
          {/* chatInput */}
          {/* TODO: move no scrollbar logic to tailwind */}
          <textarea
            rows={2}
            className={`${combinedClasses?.chatInput} no-scrollbar`}
            placeholder="Write something here"
            value={message}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                if (!event.shiftKey) {
                  event.preventDefault();
                  if (message.trim() !== '') {
                    onSend(message);
                    setMessage('');
                  }
                }
              }
            }}
            onChange={event => {
              setMessage(event.target.value);
            }}
          />
          {/* sendButton */}
          <Button
            variant={'icon-only'}
            size={'sm'}
            onClick={() => {
              onSend(message);
              setMessage('');
            }}
          >
            <SendIcon />
          </Button>
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
