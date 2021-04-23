import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Chat from './index';
import './index.css';

import Autolinker from 'autolinker';
import ReactHtmlParser from 'react-html-parser';
import ReactMarkdown from 'react-markdown';
import { ChatProps, Message } from '../ChatBox/ChatBox';

const gfm = require('remark-gfm');

const meta: Meta = {
  title: 'Chat/ Button',
  component: Chat,
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
    <div className="w-full h-1/2 flex justify-center">
      <Chat {...args} messages={messages} onSend={onSend} />
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
