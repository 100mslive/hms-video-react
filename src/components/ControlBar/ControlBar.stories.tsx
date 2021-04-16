import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ControlBarProps, ControlBar } from './index';

const meta: Meta = {
  title: 'ControlBar',
  component: ControlBar,
};

export default meta;

const Template: Story<ControlBarProps> = args => (
  <div className="bg-black">
    <ControlBar {...args} />
  </div>
);

export const Default = Template.bind({});
