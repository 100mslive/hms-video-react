import React from 'react';
import { Meta, Story } from '@storybook/react';
import { MessageModal, MessageModalProps } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'MessageModal',
  component: MessageModal,
};

export default meta;

const Template: Story<MessageModalProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: "dark" }}>
      <div>
        <MessageModal {...args} />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});
