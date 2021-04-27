import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { ChatBox, ChatProps, Message } from './ChatBox';

import Autolinker from 'autolinker';
import ReactHtmlParser from 'react-html-parser';
import ReactMarkdown from 'react-markdown';
const gfm = require('remark-gfm');

const meta: Meta = {
  title: 'Chat/ ChatBox',
  component: ChatBox,
};

export default meta;

const Template: Story<ChatProps> = args => {
  const [messages, setMesaages] = useState<Message[]>(args.messages);
  const onSend = (message: string) => {
    setMesaages(prevMessages => {
      let messages = [...prevMessages];
      messages.push({
        message,
        sender: { id: '123', displayName: 'You' },
        timeSent: 'now',
      });
      return messages;
    });
  };
  return (
    <div className="w-full h-full flex justify-center">
      <div style={{ height: '466px', width: '240px' }}>
        <ChatBox
          messages={messages}
          onSend={onSend}
          willScrollToBottom={args.willScrollToBottom}
          scrollAnimation={args.scrollAnimation}
          onClose={() => {
            alert('closing');
          }}
          messageFormatter={args.messageFormatter}
        />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  messages: [
    {
      message: 'Hi guys',
      sender: { id: '123', displayName: 'Yash' },
      timeSent: '10 mins ago',
    },
    {
      message: 'Ivy L left meeting',

      timeSent: '10 mins ago',
      notification: true,
    },
    {
      message: 'Ping me at nikhil@100ms.live',
      sender: { id: '123s', displayName: 'Nikhil' },
      timeSent: '10 mins ago',
    },
    {
      message: 'Our twiiter handle @100mslive',
      sender: { id: '123s', displayName: '100ms' },
      timeSent: '10 mins ago',
    },
    {
      message: 'Nikhil left meeting',
      timeSent: '10 mins ago',
      notification: true,
    },
  ],

  willScrollToBottom: true,
};

export const MarkDownChat = Template.bind({});
MarkDownChat.args = {
  messages: [
    {
      message: 'Hi guys',
      sender: { id: '123', displayName: 'Yash' },
      timeSent: '10 mins ago',
    },
    {
      message: 'Ivy L left meeting',
      timeSent: '10 mins ago',
      notification: true,
    },
    {
      message: `* [ ] todo
    * [x] done`,
      sender: { id: '123s', displayName: 'Nikhil' },
      timeSent: '10 mins ago',
    },
    {
      message: `> A block quote with ~strikethrough~ and a URL: https://reactjs.org.`,
      sender: { id: '123s', displayName: 'Sunita' },
      timeSent: '10 mins ago',
    },
    {
      message: `A paragraph with *emphasis* and **strong importance**`,
      sender: { id: '123s', displayName: 'Ann' },
      timeSent: '10 mins ago',
    },
  ],

  willScrollToBottom: true,
  messageFormatter: (message: string) => {
    return <ReactMarkdown remarkPlugins={[gfm]}>{message}</ReactMarkdown>;
  },
};
