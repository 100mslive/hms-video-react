import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, ButtonProps } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

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

export const Default = Basic.bind({});
Basic.args = {};
