import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Chat, ChatProps } from './Chat';

const meta: Meta = {
  title: 'Chat',
  component: Chat,
};

export default meta;

const Template: Story<ChatProps> = args => (
  <div className="w-full h-full flex justify-center">
    <div style={{ height: '466px', width: '240px' }} className="w-88 h-44">
      <Chat {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  messages: [
    {
      message: 'HII',
      sender: { id: '123', displayName: 'Eswar' },
      timeSent: '12 Dec 2012',
    },
  ],
  onSend: (message: string) => {
    alert(message);
  },
};
