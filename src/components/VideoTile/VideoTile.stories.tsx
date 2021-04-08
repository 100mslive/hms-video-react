import { Meta, Story } from '@storybook/react';
import React, { useEffect } from 'react';
import { VideoTile, VideoTileProps } from '.';

const meta: Meta = {
  title: 'Video Tile',
  component: VideoTile,
  argTypes: {
    streamTypes: {
      control: {
        type: 'select',
        options: ['camera', 'video'],
      },
    },
  },
};

export default meta;

interface VideoTileStoryProps extends VideoTileProps {
  streamTypes: 'camera' | 'video';
}

const Template: Story<VideoTileStoryProps> = args => {
  const { streamTypes, ...rest } = args;
  const video = React.createRef<HTMLVideoElement>();

  useEffect(() => {
    if (video.current) {
      if (streamTypes == 'camera')
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(function(stream) {
            //video.src = window.URL.createObjectURL(stream);
            if (video.current) video.current.srcObject = stream;
          });
      else {
        let stream = video.current.srcObject;
        if (stream && stream instanceof MediaStream) {
          var tracks = stream.getTracks();
          for (var i = 0; i < tracks.length; i++) {
            var track = tracks[i];
            track.stop();
          }
          video.current.srcObject = null;
        }
      }
      if (streamTypes == 'video') {
        video.current.srcObject = null;
        video.current.src =
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';
      }
      video.current.play();
    }
  }, [streamTypes]);

  return <VideoTile {...rest} ref={video} />;
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const DefaultVideoTile = Template.bind({});

DefaultVideoTile.args = {
  isLocal: true,
  peer: { id: '123', displayName: 'Eswar' },
  videoSource: 'landscape-video',
  audioLevel: 10,
  streamTypes: 'video',
};
