import React from 'react';
import { Meta, Story } from '@storybook/react';
import Chat from './index';
import './index.css';
import { ChatProps } from '../ChatBox/ChatBox';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Chat/ Button',
  component: Chat,
};

export default meta;

const Template: Story<ChatProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div className="w-full h-1/2 flex justify-center">
        <Chat {...args} />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  autoScrollToBottom: true,
  onSend: undefined, // use from hmsActions
};
