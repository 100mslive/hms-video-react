import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import {
  VirtualBackgroundModal,
  VirtualBackgroundProps,
} from './VirtualBackgroundModal';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { Button } from '../Button';

const meta: Meta = {
  title: 'VirtualBackgroundModal',
  component: VirtualBackgroundModal,
};

export default meta;

const Template: Story<VirtualBackgroundProps> = args => {
  const [show, setShow] = useState(true);

  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <Button variant="emphasized" onClick={() => setShow(show => !show)}>
        {show ? 'Hide Modal' : 'Show Modal'}
      </Button>
      <div>
        <VirtualBackgroundModal
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
  onClose: () => {
    alert('Clicked close!');
  },
};
