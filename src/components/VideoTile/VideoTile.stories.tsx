import { Meta, Story } from '@storybook/react';
import React from 'react';
import { VideoTile, VideoTileProps } from '.';

const meta: Meta = {
  title: 'Video Tile',
  component: VideoTile,
  argTypes: {
    audioLevel: { control: { type: 'range' } },
  },
};

export default meta;

const Template: Story<VideoTileProps> = args => (
  <div className="flex items-center justify-center" style={{ height: '80vh' }}>
    <VideoTile {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const DefaultVideoTile = Template.bind({});
export const GoogleMeetVideoTile = Template.bind({});

DefaultVideoTile.args = {
  peer: { id: '123', displayName: 'Eswar' },
  stream:
    'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4',
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: false,
  audioLevelDisplayType: 'border',
  audioLevel: 40,
};

GoogleMeetVideoTile.args = {
  peer: { id: '123', displayName: 'Eswar' },
  stream:
    'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4',
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: false,
  audioLevelDisplayType: 'inline-wave',
  audioLevel: 40,
  className: '',
};
