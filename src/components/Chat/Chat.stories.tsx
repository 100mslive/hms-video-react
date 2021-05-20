import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import Chat from './index';
import './index.css';
import { ChatProps, Message } from '../ChatBox/ChatBox';
import { fakeMessage, fakeMessages, makeFakeMessage } from '../../storybook/fixtures/chatFixtures';

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
      messages.push(makeFakeMessage(message, "You"));
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
  messages: fakeMessages,
  autoScrollToBottom: true,
};
