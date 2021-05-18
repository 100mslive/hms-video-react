import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Preview, PreviewProps } from './Preview';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Preview',
  component: Preview,
};

export default meta;

const DarkTemplate: Story<PreviewProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div>
        <Preview {...args} />
      </div>
    </HMSThemeProvider>
  );
};

const LightTemplate: Story<PreviewProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div>
        <Preview {...args} />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = DarkTemplate.bind({});
Default.args = {
  name: 'Aditya Gupta',
  joinOnClick: ({ audioMuted, videoMuted }) =>
    alert(`Join Clicked, audio and video mute are ${audioMuted} ${videoMuted}`),
  goBackOnClick: () => alert('Go Back Clicked'),
};

export const Light = LightTemplate.bind({});
Default.args = {
  name: 'Aditya Gupta',
  joinOnClick: ({ audioMuted, videoMuted }) =>
    alert(`Join Clicked, audio and video mute are ${audioMuted} ${videoMuted}`),
  goBackOnClick: () => alert('Go Back Clicked'),
};
