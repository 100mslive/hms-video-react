import React from 'react';
import { HangUpIcon, MicOnIcon, MicOffIcon, CloseIcon } from '../../icons';
import { Meta, Story } from '@storybook/react';
import { Button, ButtonProps } from './index';
import './ButtonStory.css';

const meta: Meta = {
  title: 'Button',
  component: Button,
};

export default meta;

const Leave: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center">
      <Button {...args}>
        <HangUpIcon className="mr-2" />
        Leave room
      </Button>
    </div>
  );
};

const Mic: Story<ButtonProps> = args => {
  const { classes, ...argsWithoutClasses } = args;
  return (
    <div className="w-full h-1/2 flex justify-center">
      {/* @ts-expect-error */}
      <Button {...argsWithoutClasses} classes={{ root: 'to-be-overridden' }}>
        {args.active ? <MicOffIcon /> : <MicOnIcon />}
      </Button>
    </div>
  );
};

const Close: Story<ButtonProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center">
      <Button {...args}>
        <CloseIcon />
      </Button>
    </div>
  );
};

export const Default = Leave.bind({});
Default.args = {
  variant: 'danger',
};

export const MicStory = Mic.bind({});
MicStory.args = {
  variant: 'icon-only',
  shape: 'circle',
};

export const CloseStory = Close.bind({});
CloseStory.args = {
  variant: 'no-fill',
};
