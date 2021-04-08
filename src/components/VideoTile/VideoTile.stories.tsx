import { useEffect } from '@storybook/client-api';
import { Meta, Story } from '@storybook/react';
import React, { useState } from 'react';
import { VideoTile, VideoTileProps } from '.';
import { closeMediaStream } from '../../utils';

const meta: Meta = {
  title: 'Video Tile',
  component: VideoTile,
  argTypes: {
    audioLevel: { control: { type: 'range' } },
  },
};

export default meta;

const Template: Story<VideoTileProps> = args => {
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    if (args.videoSource == 'camera') {
      window.navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function(stream) {
          window.stream = stream;
          setStream(stream);
        });
    } else if (args.videoSource == 'screen') {
      window.navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then(function(stream: MediaStream | undefined) {
          window.stream = stream;
          setStream(stream);
        });
    }

    return () => {
      closeMediaStream(window.stream);
    };
  }, [args.videoSource]);

  console.log(stream);
  return (
    <div
      className="flex items-center justify-center"
      style={{ height: '80vh' }}
    >
      <VideoTile {...args} stream={stream} />
    </div>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const DefaultVideoTile = Template.bind({});
export const GoogleMeetVideoTile = Template.bind({});

DefaultVideoTile.args = {
  isLocal: true,
  peer: { id: '123', displayName: 'Eswar' },
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: false,
  audioLevelDisplayType: 'border',
  audioLevel: 40,
};

GoogleMeetVideoTile.args = {
  isLocal: true,
  peer: { id: '123', displayName: 'Eswar' },
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: false,
  audioLevelDisplayType: 'inline-wave',
  audioLevel: 40,
  className: '',
};
