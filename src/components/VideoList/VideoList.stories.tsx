import { useEffect } from '@storybook/client-api';
import { Meta, Story } from '@storybook/react';
import React, { useState } from 'react';
import { VideoList, VideoListProps } from '.';
import { closeMediaStream } from '../../utils';
import { MediaStreamWithInfo, Peer, VideoSource } from '../../types';

const meta: Meta = {
  title: 'Video List',
  component: VideoList,
};

export default meta;

// interface VideoListStoryProps extends VideoListProps {
//   streams: {
//     stream?: MediaStream;
//     peer: Peer;
//     audioLevel?: number;
//     audioMuteStatus?: boolean;
//     videoMuteStatus?: boolean;
//     isLocal?: boolean;
//     videoSource?: VideoSource;
//   }[];
// }

const Template: Story<VideoListProps> = args => {
  const { streams, ...rest } = args;
  const isCameraStreamRequired: boolean = args.streams.some(
    stream => stream.videoSource === 'camera'
  );
  const isScreenStreamRequired: boolean = args.streams.some(
    stream => stream.videoSource === 'screen'
  );
  const [cameraStream, setCameraStream] = useState<MediaStream>();
  const [screenStream, setScreenStream] = useState<MediaStream>();

  // useEffect(() => {
  //   const track = stream?.getVideoTracks()[0];
  //   if (track) track.enabled = !args.isVideoMuted;
  // }, [args.peer.isVideoMuted]);

  // useEffect(() => {
  //   const track = stream?.getAudioTracks()[0];
  //   if (track) track.enabled = !args.isAudioMuted;
  // }, [args.isAudioMuted]);

  useEffect(() => {
    closeMediaStream(cameraStream);
    closeMediaStream(screenStream);

    if (isCameraStreamRequired) {
      window.navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function(stream) {
          // @ts-ignore
          window.stream = stream;
          console.log(stream);
          setCameraStream(stream);
        });
    }
    if (isScreenStreamRequired) {
      window.navigator.mediaDevices
        // @ts-ignore
        .getDisplayMedia({ video: true })
        .then(function(stream: MediaStream | undefined) {
          // @ts-ignore
          window.stream = stream;
          console.log(stream);
          setScreenStream(stream);
        });
    }

    return () => {
      closeMediaStream(screenStream);
      closeMediaStream(cameraStream);
    };
  }, [args.streams]);

  return (
    <div className="h-screen">
      {cameraStream && (
        <VideoList
          {...rest}
          streams={streams
            .filter(
              item =>
                item.videoSource == 'screen' || item.videoSource == 'camera'
            )
            .map((item): any => ({
              ...item,
              stream:
                item.videoSource == 'screen' ? screenStream : cameraStream,
            }))}
        />
      )}
    </div>
  );
};

export const DefaultList = Template.bind({});
DefaultList.args = {
  streams: [
    {
      stream: new MediaStream(),
      peer: { id: '123', displayName: 'Nikhil1' },
      videoSource: 'camera',
      audioLevel: 50,
    },
    {
      stream: new MediaStream(),
      peer: { id: '123', displayName: 'Nikhil2' },
      videoSource: 'camera',
      audioLevel: 100,
    },
    {
      stream: new MediaStream(),
      peer: { id: '123', displayName: 'Nikhil3' },
      videoSource: 'camera',
      audioLevel: 10,
    },
    {
      stream: new MediaStream(),
      peer: { id: '123', displayName: 'Nikhil4' },
      videoSource: 'camera',
      audioLevel: 10,
    },
    {
      stream: new MediaStream(),
      peer: { id: '123', displayName: 'Nikhil5' },
      videoSource: 'camera',
      audioLevel: 10,
    },
    {
      stream: new MediaStream(),
      peer: { id: '123', displayName: 'Nikhil6' },
      videoSource: 'camera',
      audioLevel: 10,
    },
    // {
    //   stream: new MediaStream(),
    //   peer: { id: '123', displayName: 'Nikhil' },
    //   videoSource: 'screen',
    // },
  ],
  maxTileCount: 4,
};
