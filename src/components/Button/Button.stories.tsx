import React from 'react';
import { HangUpIcon, MicOnIcon, MicOffIcon, CloseIcon } from '../../icons';
import { Meta, Story } from '@storybook/react';
import { Button, ButtonProps } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import './ButtonStory.css';

const meta: Meta = {
  title: 'Button',
  component: Button,
};

export default meta;

const Leave: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <Button {...args}>
        <HangUpIcon className="mr-2" />
        Leave room
      </Button>
    </div>
  );
};

const MicWithDangerActive: Story<ButtonProps> = args => {
  const { classes, ...argsWithoutClasses } = args;
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
        {/* @ts-expect-error */}
        <Button {...argsWithoutClasses} classes={{ root: 'to-be-overridden' }}>
          {args.active ? <MicOffIcon /> : <MicOnIcon />}
        </Button>
      </HMSThemeProvider>
    </div>
  );
};

const DarkMic: Story<ButtonProps> = args => {
  const { classes, ...argsWithoutClasses } = args;
  return (
    <div className="w-full h-1/2 flex justify-center py-4">
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
        <Button {...args}>
          {args.active ? <MicOffIcon /> : <MicOnIcon />}
        </Button>
      </HMSThemeProvider>
    </div>
  );
};

const LightMic: Story<ButtonProps> = args => {
  const { classes, ...argsWithoutClasses } = args;
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
        <Button {...args}>
          {args.active ? <MicOffIcon /> : <MicOnIcon />}
        </Button>
      </HMSThemeProvider>
    </div>
  );
};

const Close: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center py-4">
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
        <Button {...args}>
          <CloseIcon />
        </Button>
      </HMSThemeProvider>
    </div>
  );
};

const Join: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <Button {...args}>Join</Button>
    </div>
  );
};

export const Default = Leave.bind({});
Default.args = {
  variant: 'danger',
};

export const LightMicStory = LightMic.bind({});
LightMicStory.args = {
  variant: 'icon-only',
  shape: 'circle',
};

export const MicWithDangerActiveStory = MicWithDangerActive.bind({});
MicWithDangerActiveStory.args = {
  variant: 'icon-only',
  shape: 'circle',
};

export const DarkMicStory = DarkMic.bind({});
DarkMicStory.args = {
  variant: 'icon-only',
  shape: 'circle',
};

export const CloseStory = Close.bind({});
CloseStory.args = {
  variant: 'no-fill',
};

export const JoinStory = Join.bind({});
JoinStory.args = {
  variant: 'emphasized',
};
