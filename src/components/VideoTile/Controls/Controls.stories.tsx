import { Meta, Story } from '@storybook/react';
import React from 'react';
import { VideoTileControls, VideoTileControlsProps } from '.';
import { HMSThemeProvider } from '../../..';

const meta: Meta = {
  title: 'Video /TileControls',
  component: VideoTileControls,
  argTypes: {
    audioLevel: { control: { type: 'range' } },
  },
};

export default meta;

const Template: Story<VideoTileControlsProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div className="video-tile relative flex items-center justify-center h-72 sm:h-80">
        <VideoTileControls {...args} />
      </div>
    </HMSThemeProvider>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const DefaultVideoTileControls = Template.bind({});

DefaultVideoTileControls.args = {
  label: 'Eswar',
  isAudioMuted: true,
};
