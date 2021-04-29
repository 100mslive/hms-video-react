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
