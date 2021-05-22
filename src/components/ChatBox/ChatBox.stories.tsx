import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ChatBox, ChatProps } from './ChatBox';
import ReactMarkdown from 'react-markdown';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
const gfm = require('remark-gfm');

const meta: Meta = {
  title: 'Chat/ ChatBox',
  component: ChatBox,
};

export default meta;

const Template: Story<ChatProps> = args => {
  return (
    <div className="w-full h-full flex justify-center">
      <div style={{ height: '466px', width: '240px' }}>
        <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
          <ChatBox
            autoScrollToBottom={args.autoScrollToBottom}
            scrollAnimation={args.scrollAnimation}
            onClose={() => {
              alert('closing');
            }}
            messageFormatter={args.messageFormatter}
            classes={args.classes}
          />
        </HMSThemeProvider>
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  classes: {
    header: 'bg-red-500',
  },
  autoScrollToBottom: true,
};

export const MarkDownChat = Template.bind({});
MarkDownChat.args = {
  autoScrollToBottom: true,
  messageFormatter: (message: string) => {
    return <ReactMarkdown remarkPlugins={[gfm]}>{message}</ReactMarkdown>;
  },
};
