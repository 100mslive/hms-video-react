import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Text, TextProps } from './index';

const meta: Meta = {
  title: 'Typography',
  component: Text,
};

export default meta;

const Basic: Story<TextProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <Text {...args}>Hello World</Text>
    </div>
  );
};

export const Default = Basic.bind({});
Basic.args = {};
