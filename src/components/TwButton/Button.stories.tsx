import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, ButtonProps } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { MicOffIcon, MicOnIcon } from '../Icons';

const meta: Meta = {
  title: 'TwButton',
  component: Button,
};

export default meta;

const config = {
  theme: {
    extend: {
      colors: {
        brand: {
          tint: '#74AAFF',
          main: '#424874',
          shade: '#0B326F',
        },
        red: {
          tint: '#E66977',
          main: '#424874',
          shade: '#6F2229',
        },
      },
    },
  },
};

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

const Classes: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
        <Button
          classes={{
            rootStandard: 'bg-red-main',
            rootRectangle: 'rounded-none',
          }}
          icon={<MicOnIcon />}
          onClick={() => alert('Hello World')}
          {...args}
        >
          Red Standard
        </Button>
      </HMSThemeProvider>
    </div>
  );
};

const IconOnly: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
        <Button iconOnly iconSize="sm" {...args}>
          <MicOffIcon />
        </Button>
      </HMSThemeProvider>
    </div>
  );
};

const Custom: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <HMSThemeProvider config={config} appBuilder={{ theme: 'dark' }}>
        <Button {...args}>Custom Config</Button>
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

export const ButtonClasses = Classes.bind({});
Basic.args = {};

export const IconOnlyButton = IconOnly.bind({});
Basic.args = {};

export const CustomConfig = Custom.bind({});
Basic.args = {};
