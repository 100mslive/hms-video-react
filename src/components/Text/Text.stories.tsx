import React from 'react';
import { Meta, Story } from '@storybook/react';
import Text from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Typography',
  component: Text,
};

export default meta;

const Basic: Story = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <Text {...args}>Leave room</Text>
    </div>
  );
};

export const Default = Basic.bind({});
Basic.args = {};
