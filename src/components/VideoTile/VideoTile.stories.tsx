import { Meta, Story } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { VideoTile, VideoTileProps } from '.';
import VideoTileDocs from './VideoTile.mdx';
import { closeMediaStream, getVideoTileLabel } from '../../utils';
import { VideoTileControls } from './Controls';
import { MicOff, MicOn } from '../../icons';

const meta: Meta = {
  title: 'Video / Tile',
  component: VideoTile,
  parameters: {
    docs: {
      page: VideoTileDocs,
    },
  },
  argTypes: {
    audioLevel: { control: { type: 'range' } },
    stream: { control: { disable: true } },
    controlsComponent: { control: { disable: true } },
  },
};

export default meta;

const Template: Story<VideoTileProps> = (args: VideoTileProps) => {
  const [stream, setStream] = useState<MediaStream>();

  // Stream is not added in dependency array to avoid creating a new stream for every mute/unmute change which causes visual flicker in the storybook canvas.
  useEffect(() => {
    const track = stream?.getVideoTracks()[0];
    if (track) {
      track.enabled = !args.isVideoMuted;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.isVideoMuted]);

  useEffect(() => {
    const track = stream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !args.isAudioMuted;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.isAudioMuted]);

  useEffect(() => {
    closeMediaStream(stream);

    if (args.videoSource === 'camera') {
      window.navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(function (stream) {
          setStream(stream);
        });
    } else if (args.videoSource === 'screen') {
      window.navigator.mediaDevices
        // @ts-ignore
        .getDisplayMedia({ video: true })
        .then(function (stream: MediaStream | undefined) {
          setStream(stream);
        });
    }
    return () => {
      closeMediaStream(stream);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.videoSource]);

  return (
    <div className="flex items-center justify-center h-full sm:h-80">
      {stream && <VideoTile {...args} stream={stream} />}
    </div>
  );
};

const MeetTemplate: Story<VideoTileProps> = (args) => {
  const [stream, setStream] = useState<MediaStream>();

  useEffect(() => {
    const track = stream?.getVideoTracks()[0];
    if (track) {
      track.enabled = !args.isVideoMuted;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.isVideoMuted]);

  useEffect(() => {
    const track = stream?.getAudioTracks()[0];
    if (track) {
      track.enabled = !args.isAudioMuted;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.isAudioMuted]);

  useEffect(() => {
    closeMediaStream(stream);

    if (args.videoSource === 'camera') {
      window.navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(function (stream) {
          setStream(stream);
        });
    } else if (args.videoSource === 'screen') {
      window.navigator.mediaDevices
        // @ts-ignore
        .getDisplayMedia({ video: true })
        .then(function (stream: MediaStream | undefined) {
          setStream(stream);
        });
    }

    return () => {
      closeMediaStream(stream);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.videoSource]);

  return (
    <div className="flex items-center justify-center h-72 sm:h-80">
      {stream && (
        <VideoTile
          {...args}
          stream={stream}
          controlsComponent={
            <>
              {args.allowRemoteMute && (
                <div className="inset-center">
                  <div className="rounded-full text-white py-3 px-4 opacity-40 bg-gray-300 hover:opacity-70 ">
                    {args.isAudioMuted ? MicOff : MicOn}
                  </div>
                </div>
              )}
              <VideoTileControls
                label={getVideoTileLabel(
                  args.peer.displayName,
                  args.isLocal || false,
                  args.videoSource,
                )}
                isAudioMuted={args.isAudioMuted}
                showAudioMuteStatus={args.showAudioMuteStatus}
                showGradient={false}
                allowRemoteMute={false}
                showAudioLevel={args.showAudioLevel}
                audioLevelDisplayType="inline-wave"
                audioLevel={args.audioLevel}
                classes={{
                  labelContainer: 'flex justify-around items-center w-min',
                }}
              />
            </>
          }
        />
      )}
    </div>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const DefaultVideoTile = Template.bind({});
export const GoogleMeetVideoTile = MeetTemplate.bind({});
export const CampFireVideoTile = Template.bind({});

DefaultVideoTile.args = {
  isLocal: true,
  peer: { id: '123', displayName: 'Eswar' },
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: true,
  audioLevelDisplayType: 'border',
  audioLevel: 40,
  videoSource: 'camera',
};

GoogleMeetVideoTile.args = {
  isLocal: true,
  peer: { id: '123', displayName: 'Eswar' },
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: true,
  audioLevelDisplayType: 'inline-wave',
  audioLevel: 40,
  classes: {
    video: ' ',
  },
  videoSource: 'camera',
};

CampFireVideoTile.args = {
  isLocal: true,
  peer: { id: '123', displayName: 'Eswar' },
  displayShape: 'circle',
  showAudioLevel: true,
  audioLevelDisplayType: 'border',
  audioLevel: 40,
  videoSource: 'camera',
};
