import React, { useEffect, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { ChatBox, ChatProps, Message } from './ChatBox';
import ReactMarkdown from 'react-markdown';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { fakeMessages, makeFakeMessage } from '../../storybook/fixtures/chatFixtures';
const gfm = require('remark-gfm');

const meta: Meta = {
  title: 'Chat/ ChatBox',
  component: ChatBox,
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
  useEffect(() => {
    setInterval(() => {
      setMesaages(prevMessages => {
        let messages = [...prevMessages];
        messages.push(makeFakeMessage("Ghost message", "ghost"));
        return messages;
      });
    }, 8000);
  }, []);
  return (
    <div className="w-full h-full flex justify-center">
      <div style={{ height: '466px', width: '240px' }}>
        <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
          <ChatBox
            messages={messages}
            onSend={onSend}
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
  messages: fakeMessages,
  classes: {
    header: 'bg-red-500',
  },
  autoScrollToBottom: true,
};

export const MarkDownChat = Template.bind({});
MarkDownChat.args = {
  messages: fakeMessages,

  autoScrollToBottom: true,
  messageFormatter: (message: string) => {
    return <ReactMarkdown remarkPlugins={[gfm]}>{message}</ReactMarkdown>;
  },
};
