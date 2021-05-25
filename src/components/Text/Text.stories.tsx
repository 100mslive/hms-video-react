import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Text, TextProps } from './Text';
import { css } from 'twind/css';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Typography',
  component: Text,
};

export default meta;

const Basic: Story<TextProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div className="w-full h-1/2 flex justify-center bg-white py-4">
        <Text {...args}>Hello World</Text>
      </div>
    </HMSThemeProvider>
  );
};

const Class: Story<TextProps> = args => {
  const userClasses = {
    rootBodyLg: 'font-bold text-red-800 text-7xl',
  };
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div className="w-full h-1/2 flex justify-center bg-white py-4">
        <Text classes={userClasses} {...args}>
          Override By Classes
        </Text>
      </div>
    </HMSThemeProvider>
  );
};

const Style: Story<TextProps> = args => {
  const styles = css`
    color: purple;
    font-size: 4rem;
  `;
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div className="w-full h-1/2 flex justify-center bg-white py-4">
        <Text styles={styles} {...args}>
          Override By Styles Props
        </Text>
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Basic.bind({});
Basic.args = {};

export const ClassOverride = Class.bind({});
Basic.args = {};

export const StyleOverride = Style.bind({});
Basic.args = {};
