import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Avatar, AvatarProps } from './index';

const meta: Meta = {
  title: 'Avatar',
  component: Avatar,
};

export default meta;

const Basic: Story<AvatarProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <Avatar {...args}>Hello World</Avatar>
    </div>
  );
};

export const Default = Basic.bind({});
Basic.args = {};
