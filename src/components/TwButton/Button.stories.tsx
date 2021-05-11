import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, ButtonProps } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { MicOffIcon } from '../Icons';

const meta: Meta = {
  title: 'TwButton',
  component: Button,
};

export default meta;

const Basic: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
        <Button {...args}>Leave Room</Button>
      </HMSThemeProvider>
    </div>
  );
};

const WithIcon: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
        <Button icon={<MicOffIcon />} {...args}>
          Leave Room
        </Button>
      </HMSThemeProvider>
    </div>
  );
};

const IconRight: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
        <Button icon={<MicOffIcon />} iconRight={true} {...args}>
          Leave Room
        </Button>
      </HMSThemeProvider>
    </div>
  );
};

export const Default = Basic.bind({});
Basic.args = {};

export const IconButton = WithIcon.bind({});
Basic.args = {};

export const IconRightButton = IconRight.bind({});
Basic.args = {};
