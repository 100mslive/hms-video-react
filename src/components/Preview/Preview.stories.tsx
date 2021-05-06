import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Preview, PreviewProps } from './Preview';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Preview',
  component: Preview,
};

export default meta;

const Template: Story<PreviewProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div>
        <Preview {...args} />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  name: 'Aditya Gupta',
  joinOnClick: ({ audioMuted, videoMuted }) =>
    alert(`Join Clicked, audio and video mute are ${audioMuted} ${videoMuted}`),
  goBackOnClick: () => alert('Go Back Clicked'),
};
