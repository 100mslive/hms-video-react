import { Meta, Story } from '@storybook/react';
import React, { useState, useEffect, useRef } from 'react';
import { VideoTile, VideoTileProps } from '.';
import VideoTileDocs from './VideoTile.mdx';
import { getVideoTileLabel } from '../../utils';
import { VideoTileControls } from './Controls';
import { MicOffIcon, MicOnIcon } from '../Icons';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { storyBookSDK } from '../../storybook/store/SetUpFakeStore';

declare global {
  interface HTMLVideoElement {
    captureStream(frameRate?: number): MediaStream;
  }
}

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
  //decorators: [addDummyVideos] //TODO this is a placeholder for future use
};

export default meta;

function VideoTileInnerComponent() {
  return (
    <span className="absolute bottom-4 bg-red-600 left-4">HandRaiseIcon</span>
  );
}

const Template: Story<VideoTileProps> = (args: VideoTileProps) => {
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>();
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>();
  const dummyVideoRef = useRef<HTMLVideoElement>(null);
  //const testVideoRef = useRef<HTMLVideoElement>(null);
  // Stream is not added in dependency array to avoid creating a new stream for every mute/unmute change which causes visual flicker in the storybook canvas.
  useEffect(() => {
    const track = videoTrack;
    if (track) {
      track.enabled = !args.isVideoMuted;
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.isVideoMuted]);

  useEffect(() => {
    const track = audioTrack;
    if (track) {
      track.enabled = !args.isAudioMuted;
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.isAudioMuted]);

  return (
    <HMSThemeProvider
      config={{}}
      appBuilder={{ theme: 'dark', avatarType: 'initial' }}
    >
      <div className="flex items-center justify-center h-full sm:h-80">
        <video
          crossOrigin="anonymous"
          className="hidden"
          width="400"
          height="225"
          ref={dummyVideoRef}
          loop
          autoPlay
          onPlay={() => {
            if (dummyVideoRef && dummyVideoRef.current) {
              setVideoTrack(
                dummyVideoRef.current.captureStream().getVideoTracks()[0],
              );
              setAudioTrack(
                dummyVideoRef.current.captureStream().getAudioTracks()[0],
              );
            }
          }}
        ></video>
        {/* <video width="400" height="225" loop autoPlay muted ref={testVideoRef}/> */}
        <VideoTile
          {...args}
          peer={(() => storyBookSDK.getRandomPeer())()}
          videoTrack={videoTrack}
          audioTrack={audioTrack}
          innerComponent={VideoTileInnerComponent()}
        />
      </div>
    </HMSThemeProvider>
  );
};

const MeetTemplate: Story<VideoTileProps> = args => {
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>();
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>();
  const dummyVideoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
        <div className="flex items-center justify-center h-72 sm:h-80">
          <video
            crossOrigin="anonymous"
            className="hidden"
            width="400"
            height="225"
            ref={dummyVideoRef}
            loop
            autoPlay
            onPlay={() => {
              if (dummyVideoRef && dummyVideoRef.current) {
                setVideoTrack(
                  dummyVideoRef.current.captureStream().getVideoTracks()[0],
                );
                setAudioTrack(
                  dummyVideoRef.current.captureStream().getAudioTracks()[0],
                );
              }
            }}
          ></video>
          {
            <VideoTile
              {...args}
              peer={(() => storyBookSDK.getRandomPeer())()}
              videoTrack={videoTrack}
              audioTrack={audioTrack}
              controlsComponent={
                <>
                  {args.allowRemoteMute && (
                    <div className="inset-center">
                      <div className="rounded-full text-white py-3 px-4 opacity-40 bg-gray-300 hover:opacity-70 ">
                        {args.isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
                      </div>
                    </div>
                  )}
                  <VideoTileControls
                    label={getVideoTileLabel('Tushar', args.isLocal || false)}
                    isAudioMuted={args.isAudioMuted}
                    showAudioMuteStatus={args.showAudioMuteStatus}
                    showGradient={false}
                  />
                </>
              }
            />
          }
        </div>
      </HMSThemeProvider>
    </>
  );
};

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing

export const DefaultVideoTile = Template.bind({});
export const GoogleMeetVideoTile = MeetTemplate.bind({});
export const CampFireVideoTile = Template.bind({});
export const ClassesOverrideVideoTile = Template.bind({});

DefaultVideoTile.args = {
  isLocal: true,
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: true,
  audioLevelDisplayType: 'border',
  audioLevel: 40,
  classes: { root: 'hello' },
};

GoogleMeetVideoTile.args = {
  isLocal: true,
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: true,
  audioLevelDisplayType: 'inline-wave',
  audioLevel: 40,
};

CampFireVideoTile.args = {
  isLocal: true,
  displayShape: 'circle',
  showAudioLevel: true,
  audioLevelDisplayType: 'border',
  audioLevel: 40,
};

ClassesOverrideVideoTile.args = {
  isLocal: true,
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: true,
  audioLevelDisplayType: 'border',
  audioLevel: 40,
  classes: { videoContainer: 'border-8 border-red-800' },
};
