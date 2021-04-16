import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Header } from './index';

const meta: Meta = {
  title: 'Header',
  component: Header,
};

export default meta;

const Template: Story = args => (
  <div className="bg-black">
    <Header {...args} />
  </div>
);

export const Default = Template.bind({});
