import React, { useEffect, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { ControlBarProps, ControlBar } from './index';
import { faDeaf } from '@fortawesome/free-solid-svg-icons';

const meta: Meta = {
  title: 'ControlBar',
  component: ControlBar,
};

export default meta;

const Template: Story<ControlBarProps> = args => {
  return (<div className="bg-black">
    <ControlBar {...args} />
  </div>)
  
};

export const Default = Template.bind({});
Default.args = {
  audioButtonOnClick: () => {
    // alert('audio toggled');
  },
  videoButtonOnClick: () => {
    // alert('video toggled');
  },
  leaveButtonOnClick: () => {
    // alert('left room');
  },
};
