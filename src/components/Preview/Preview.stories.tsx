import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Preview, PreviewProps } from './Preview';

const meta: Meta = {
  title: 'Preview',
  component: Preview,
};

export default meta;

const Template: Story<PreviewProps> = args => {
  return (
    <div className="bg-black flex h-screen w-screen justify-center items-center">
      <Preview {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  name: 'Aditya Gupta',
  joinOnClick: ({ audioMuted, videoMuted }) =>
    alert(`Join Clicked, audio and video mute are ${audioMuted} ${videoMuted}`),
  goBackOnClick: () => alert('Go Back Clicked'),
};
