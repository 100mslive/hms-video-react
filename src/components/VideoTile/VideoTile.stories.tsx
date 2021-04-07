import { Meta, Story } from '@storybook/react';
import React from 'react';
import { VideoTile, VideoTileProps } from '.';

const meta: Meta = {
  title: 'Video Tile',
  component: VideoTile,
};

export default meta;

const Template: Story<VideoTileProps> = args => <VideoTile {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const DefaultVideoTile = Template.bind({});

DefaultVideoTile.args = {
  isLocal: true,
  peer: { id: '123', displayName: 'Eswar' },
  videoSource: 'landscape-video',
  stream:
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  audioLevel: 10,
};
