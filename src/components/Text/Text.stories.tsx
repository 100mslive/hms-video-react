import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Text, TextProps } from './index';
import { css } from 'twind/css';

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

const Class: Story<TextProps> = args => {
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <Text className="font-bold text-red-800 text-7xl" {...args}>
        Override By ClassName
      </Text>
    </div>
  );
};

const Style: Story<TextProps> = args => {
  const styles = css`
    color: purple;
    font-size: 4rem;
  `;
  return (
    <div className="w-full h-1/2 flex justify-center bg-white py-4">
      <Text
        styles={styles}
        className="font-bold text-red-800 text-5xl"
        {...args}
      >
        Override By Styles Props
      </Text>
    </div>
  );
};

export const Default = Basic.bind({});
Basic.args = {};

export const ClassOverride = Class.bind({});
Basic.args = {};

export const StyleOverride = Style.bind({});
Basic.args = {};
