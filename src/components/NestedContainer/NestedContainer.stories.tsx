import React from 'react';
import { Meta, Story } from '@storybook/react';
import { NestedContainer, ContainerProps } from './index';

const meta: Meta = {
  title: 'NestedContainer',
  component: NestedContainer,
};

export default meta;

const Box: Story<ContainerProps> = args => {
  const userClasses = {
    rootContainer: 'p-8 bg-red-300',
  };
  return <NestedContainer classes={userClasses} />;
};

export const TempBox = Box.bind({});
Box.args = {};
