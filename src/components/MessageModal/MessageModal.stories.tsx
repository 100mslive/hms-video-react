import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { MessageModal, MessageModalProps } from './MessageModal';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { Button } from '../Button';

const meta: Meta = {
  title: 'MessageModal',
  component: MessageModal,
};

export default meta;

const Template: Story<MessageModalProps> = args => {
  const [show, setShow] = useState(true);

  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <Button variant="emphasized" onClick={() => setShow(show => !show)}>
        {show ? 'Hide Modal' : 'Show Modal'}
      </Button>
      <div>
        <MessageModal
          {...args}
          show={show}
          onClose={() => {
            setShow(show => !show);
            args.onClose();
          }}
        />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'This is a modal!',
  body: 'This is some message about the modal.',
  onClose: () => {
    alert('Clicked close!');
  },
};
