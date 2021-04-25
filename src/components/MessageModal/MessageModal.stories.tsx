import React from 'react';
import { Meta, Story } from '@storybook/react';
import { MessageModal, MessageModalProps } from './index';

const meta: Meta = {
  title: 'MessageModal',
  component: MessageModal,
};

export default meta;

const Template: Story<MessageModalProps> = args => {
  return (
    <div className="bg-black">
      <MessageModal {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Your Camera and Mic is Blocked',
  message:
    '100ms wants to access your camera and microphone so that other participants can see and hear you',
  secondary: 'Click Allow to continue',
};
