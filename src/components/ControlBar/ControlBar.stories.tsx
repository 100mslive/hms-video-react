import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { ControlBarProps, ControlBar } from './index';

const meta: Meta = {
  title: 'ControlBar',
  component: ControlBar,
};

export default meta;

const Template: Story<ControlBarProps> = args => {
  return (
    <div className="bg-black ">
      <ControlBar {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  audioButtonOnClick: (e: React.MouseEvent) => {
    alert('audio toggled');
  },
  videoButtonOnClick: (e: React.MouseEvent) => {
    alert('video toggled');
  },
  leaveButtonOnClick: (e: React.MouseEvent) => {
    alert('left room');
  },
  screenshareButtonOnClick: () => {
    alert('Share Screen room');
  },
  chatButtonOnClick: () => {
    alert('chat button clicked');
  },
};
