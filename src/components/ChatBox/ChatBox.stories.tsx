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
        sender: 'You',
        time: new Date(),
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
      sender: 'Yash',
      time: new Date(),
    },
    {
      message: 'Ivy L left meeting',
      time: new Date(),
      sender: 'admin',
      notification: true,
    },
    {
      message: 'Ping me at nikhil@100ms.live',
      sender: 'Nikhil',
      time: new Date(),
    },
    {
      message: 'Our twiiter handle @100mslive',
      sender: '100ms',
      time: new Date(),
    },
    {
      message: 'Nikhil left meeting',
      time: new Date(),
      notification: true,
      sender: 'admin',
    },
  ],

  willScrollToBottom: true,
};

export const MarkDownChat = Template.bind({});
MarkDownChat.args = {
  messages: [
    {
      message: 'Hi guys',
      sender: 'Yash',
      time: new Date(),
    },
    {
      message: 'Ivy L left meeting',
      time: new Date(),
      notification: true,
      sender: 'admin',
    },
    {
      message: `* [ ] todo
    * [x] done`,
      sender: 'Nikhil',
      time: new Date(),
    },
    {
      message: `> A block quote with ~strikethrough~ and a URL: https://reactjs.org.`,
      sender: 'Sunita',
      time: new Date(),
    },
    {
      message: `A paragraph with *emphasis* and **strong importance**`,
      sender: 'Ann',
      time: new Date(),
    },
  ],

  willScrollToBottom: true,
  messageFormatter: (message: string) => {
    return <ReactMarkdown remarkPlugins={[gfm]}>{message}</ReactMarkdown>;
  },
};
