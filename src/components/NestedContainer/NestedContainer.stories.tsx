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
    wrapperContainer: 'p-8 bg-blue-300',
    textContainer: 'p-8 bg-green-300',
    textHeader: 'text-gray-800',
    textParagraph: 'text-purple-600',
  };
  return <NestedContainer classes={userClasses} />;
};

export const TempBox = Box.bind({});
Box.args = {};
