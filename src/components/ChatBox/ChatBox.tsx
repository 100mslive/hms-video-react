import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  HMSMessage,
  selectMessagesByPeerID,
  selectMessagesByRole,
  selectPeerNameByID,
  selectBroadcastMessages,
  selectBroadcastMessagesUnreadCount,
  selectMessagesUnreadCountByRole,
  selectMessagesUnreadCountByPeerID,
} from '@100mslive/hms-video-store';
import { CloseIcon, DownCaratIcon, PeopleIcon, SendIcon } from '../Icons';
import { Button } from '../Button';
import { ChatSelector } from './ChatSelector';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { ChatLink, scrollToBottom } from './chatBoxUtils';
import './index.css';

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
  time?: string;
  noMessageRoot?: string;
  footer?: string;
  chatInput?: string;
  unreadMessagesContainer?: string;
  unreadMessagesInner?: string;
  unreadIcon?: string;
}

const defaultClasses: ChatBoxClasses = {
  root: 'w-full h-full  rounded-2xl flex flex-col shadow-2 relative',
  header: `bg-white dark:bg-gray-200 rounded-t-2xl p-3 text-gray-300 dark:text-gray-500 flex flex-col justify-center items-center shadow border-b-1 border-gray-500 cursor-pointer`,
  headerLine: 'w-8 h-1 rounded bg-white dark:bg-gray-400 m-2',
  headerRoot: 'flex w-full justify-between',
  headerText: 'text-gray-300 dark:text-gray-500 flex items-center',
  headerCloseButton: 'focus:outline-none',
  messageBox:
    'bg-white dark:bg-gray-100 w-full h-0 p-3 text-gray-300 dark:text-gray-500 overflow-y-auto no-scrollbar flex-auto',
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

const customClasses: ChatBoxClasses = {
  messageBox: 'hmsui-chatBox-no-scrollbar',
  chatInput: 'hmsui-chatBox-no-scrollbar',
};
export interface Message extends HMSMessage {
  notification?: boolean;
  direction?: 'left' | 'right' | 'center';
}
export interface ChatProps {
  messages?: Message[];
  onSend?: (message: string) => void;
  onClose?: () => void; // when the chat box is closed
  autoScrollToBottom?: boolean;
  scrollAnimation?: ScrollBehavior;
  messageFormatter?: (message: string, receiver?: string) => React.ReactNode;
  /**
   * extra classes added  by user
   */
  classes?: ChatBoxClasses;
  timeFormatter?: (date: Date) => string;
}

export const ChatBox = ({
  messages,
  onSend,
  onClose,
  autoScrollToBottom = true, //TODO shouldn't be exposed as a prop
  scrollAnimation = 'auto', //TODO shouldn't be exposed as a prop
  messageFormatter = (message: string) => {
    return (
      <div className="whitespace-pre-wrap">
        <ChatLink text={message} />
      </div>
    );
  },
  classes,
  timeFormatter = (date: Date) => {
    const min = date.getMinutes();
    const minString = min < 10 ? `0${min}` : min;
    return `${date.getHours()}:${minString}`;
  },
}: ChatProps) => {
  const { tw, toast } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ChatBoxClasses>({
        tw,
        classes,
        customClasses,
        defaultClasses,
        tag: 'hmsui-chatBox',
      }),
    [],
  );
  const hmsActions = useHMSActions();
  const [selection, setSelection] = useState({ role: '', peerId: '' });
  const [showChatSelection, setShowChatSelection] = useState(false);
  const selectedPeerName = useHMSStore(selectPeerNameByID(selection.peerId));
  const storeMessageSelector = selection.role
    ? selectMessagesByRole(selection.role)
    : selection.peerId
    ? selectMessagesByPeerID(selection.peerId)
    : selectBroadcastMessages;
  const storeUnreadMessageCountSelector = selection.role
    ? selectMessagesUnreadCountByRole(selection.role)
    : selection.peerId
    ? selectMessagesUnreadCountByPeerID(selection.peerId)
    : selectBroadcastMessagesUnreadCount;

  const storeMessages = useHMSStore(storeMessageSelector) || [];
  const unreadCount = useHMSStore(storeUnreadMessageCountSelector);

  messages = messages || storeMessages;

  const sendMessage = async (message: string) => {
    if (onSend) {
      onSend(message);
      return;
    }
    try {
      if (selection.role) {
        await hmsActions.sendGroupMessage(message, [selection.role]);
      } else if (selection.peerId) {
        await hmsActions.sendDirectMessage(message, selection.peerId);
      } else {
        await hmsActions.sendBroadcastMessage(message);
      }
    } catch (error) {
      toast((error as Error).message);
    }
  };
  const [messageDraft, setMessageDraft] = useState('');
  // a dummy element with messagesEndRef is created and put in the end
  const { ref: messagesEndRef, inView: messagesEndInView } = useInView();
  const messageListRef = useRef<HTMLDivElement>(null);

  /** Effect to scroll to bottom when chat is opened */
  useEffect(() => {
    if (messageListRef.current) {
      scrollToBottom(messageListRef, scrollAnimation);
    }
  }, []); //eslint-disable-line

  useEffect(() => {
    if (messages && messages.length > 0) {
      const myOwnMessage = messages[messages.length - 1].senderName === 'You';
      if (autoScrollToBottom && (myOwnMessage || messagesEndInView)) {
        scrollToBottom(messageListRef, scrollAnimation);
        hmsActions.setMessageRead(true);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndInView && unreadCount > 0) {
      // Mark only crrent view messages as read
      messages?.forEach(message => {
        hmsActions.setMessageRead(true, message.id);
      });
    }
  }, [
    selection.role,
    selection.peerId,
    messages,
    messagesEndInView,
    unreadCount,
  ]);

  return (
    <React.Fragment>
      {/* root */}
      <div className={styler('root')}>
        {/* header */}
        <div className={styler('header')}>
          {/* header-line */}
          {/* <div className={styler('headerLine')}></div> */}
          {/* header-root */}
          <div className={styler('headerRoot')}>
            {/* header-text */}
            <div
              className={styler('headerText')}
              onClick={() => setShowChatSelection(value => !value)}
            >
              <PeopleIcon />
              <span>
                {selectedPeerName || selection.role || 'Everyone'}&nbsp;
              </span>
              <DownCaratIcon width={12} height={12} />
            </div>
            <div>
              <Button
                iconOnly
                variant="no-fill"
                iconSize="sm"
                size="sm"
                onClick={() => {
                  if (showChatSelection) {
                    setShowChatSelection(false);
                    return;
                  }
                  if (onClose) {
                    onClose();
                  }
                }}
              >
                <CloseIcon />
              </Button>
            </div>
          </div>
        </div>
        <ChatSelector
          selectedRole={selection.role}
          selectedPeerID={selection.peerId}
          show={showChatSelection}
          onChange={({ peer, role }) => {
            setSelection({ role: role, peerId: peer });
            setShowChatSelection(false);
          }}
        />
        {/* messageBox */}
        {/* TODO: move no scroll bar css logic to tailwind */}
        <div className={`${styler('messageBox')}`} ref={messageListRef}>
          {messages.map(message => {
            return message.notification ? (
              /* notificationRoot */
              <div className={styler('notificationRoot')}>
                {/* notificationInfo*/}
                <div className={styler('notificationInfo')}>
                  {/*notificationText*/}
                  <span className={styler('notificationText')}>
                    {messageFormatter
                      ? messageFormatter(message.message)
                      : message.message}
                  </span>
                  <span className={styler('time')}>
                    {timeFormatter(message.time)}
                  </span>
                </div>
              </div>
            ) : (
              /* messageRoot */
              <div className={styler('messageRoot')} key={message.id}>
                {/* messageInfo */}
                <div className={styler('messageInfo')}>
                  {/* messageSender */}
                  <span className={styler('messageSender')}>
                    {message.senderName}
                  </span>
                  {/* messageTime */}
                  <span className={styler('messageTime')}>
                    {timeFormatter(message.time)}
                  </span>
                </div>
                {/* messageText */}
                <div className={styler('messageText')}>
                  {messageFormatter
                    ? messageFormatter(message.message)
                    : message.message}
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            /* NoMessageRoot */
            <div className={styler('noMessageRoot')}>
              There are no messages here.
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>
        {/* footer */}
        <div className={styler('footer')}>
          {unreadCount !== 0 && (
            <div className={styler('unreadMessagesContainer')}>
              <div
                className={styler('unreadMessagesInner')}
                onClick={() => {
                  scrollToBottom(messageListRef, scrollAnimation);
                }}
              >
                {`New message${unreadCount > 1 ? 's' : ''}`}
                <DownCaratIcon className={styler('unreadIcon')} />
              </div>
            </div>
          )}
          {/* chatInput */}
          {/* TODO: move no scrollbar logic to tailwind */}
          <textarea
            rows={2}
            className={`${styler('chatInput')}`}
            placeholder="Write something here"
            value={messageDraft}
            onKeyPress={async event => {
              if (event.key === 'Enter') {
                if (!event.shiftKey) {
                  event.preventDefault();
                  if (messageDraft.trim() !== '') {
                    await sendMessage(messageDraft);
                    setMessageDraft('');
                  }
                }
              }
            }}
            onChange={event => {
              setMessageDraft(event.target.value);
            }}
          />
          {/* sendButton */}
          <Button
            iconOnly
            variant={'no-fill'}
            iconSize={'sm'}
            size="sm"
            onClick={async () => {
              await sendMessage(messageDraft);
              setMessageDraft('');
            }}
          >
            <SendIcon />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};
