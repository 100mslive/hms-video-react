import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Header, HeaderProps } from './index';

const meta: Meta = {
  title: 'Header',
  component: Header,
};

export default meta;

const Template: Story<HeaderProps> = args => (
  <div className="bg-black">
    <Header {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {
  peer: { id: '123', displayName: 'Siddhant' },
  time: 1865,
};