import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Chat from './index';
import './index.css';
import { ChatProps, Message } from '../ChatBox/ChatBox';

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
        sender: 'You',
        time: new Date(),
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
      sender: 'Yash',
      time: new Date(),
    },
    {
      message: 'Ivy L left meeting',
      sender: 'admin',
      time: new Date(),
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
      sender: 'admin',
      time: new Date(),
      notification: true,
    },
  ],

  willScrollToBottom: true,
};
