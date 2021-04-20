import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Chat, ChatProps, Message } from './Chat';

const meta: Meta = {
  title: 'Chat',
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
      <div style={{ height: '300px', width: '240px' }} className="w-88 h-44">
        <Chat messages={messages} onSend={onSend} />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  messages: [
    {
      message: 'Hi guys',
      sender: { id: '123', displayName: 'Eswar' },
      timeSent: '10 mins ago',
    },
    {
      message: 'Ivy L left meeting',

      timeSent: '10 mins ago',
      notification: true,
    },
  ],
};
