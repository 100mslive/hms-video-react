import { Meta, Story } from '@storybook/react';
import React, { useRef } from 'react';
import { VideoList, VideoListProps } from '.';
import { getVideoTileLabel } from '../../utils';
import { VideoTileControls } from '../VideoTile/Controls';
import { MicOffIcon, MicOnIcon } from '../Icons';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { fakeStreamsWithInfo } from '../../storybook/fixtures/streamFixtures';
import { HMSPeer, HMSTrack } from '../../store/schema';
import { storyBookSDK } from '../../storybook/store/SetUpFakeStore';
declare global {
  interface HTMLVideoElement {
    captureStream(frameRate?: number): MediaStream;
  }
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }
}

const meta: Meta = {
  title: 'Video/ List',
  component: VideoList,
  argTypes: {
    maxTileCount: { control: { type: 'range' } },
    maxRowCount: { control: { type: 'range' } },
    maxColCount: { control: { type: 'range' } },
    videoTileControls: { control: { disable: true } },
    width: { control: false },
    height: { control: { disable: true } },
  },
  parameters: { controls: { sort: 'requiredFirst' } },
};

export default meta;

interface VideoListStoryProps extends VideoListProps {
  width?: string;
  height?: string;
}

const Template: Story<VideoListStoryProps> = args => {
  const dummyCameraVideoRef = useRef<HTMLVideoElement>(null);
  const dummyScreenVideoRef = useRef<HTMLVideoElement>(null);

  return (
    <HMSThemeProvider
      config={{
        theme: {
          extend: {
            fontFamily: {
              sans: ['Montserrat', 'sans-serif'],
              body: ['Montserrat', 'sans-serif'],
            },
          },
        },
      }}
      appBuilder={{
        theme: 'dark',
        videoTileAspectRatio: {
          width: 1,
          height: 1,
        },
      }}
    >
      <div className="flex items-center justify-center h-screen">
        <video
          crossOrigin="anonymous"
          className="hidden"
          width="400"
          height="225"
          ref={dummyCameraVideoRef}
          src="https://res.cloudinary.com/dlzh3j8em/video/upload/v1618618246/pexels-mart-production-7261921_XCEC2bNM_osJG_lhdtua.mp4"
          loop
          autoPlay
        ></video>
        <video
          crossOrigin="anonymous"
          className="hidden"
          width="400"
          height="225"
          ref={dummyScreenVideoRef}
          src="https://res.cloudinary.com/dlzh3j8em/video/upload/v1618618376/Screen_Recording_2021-04-17_at_5.36.24_AM_if70nz_wl31nt.mp4"
          loop
          autoPlay
        ></video>
        <VideoList {...args} peers={storyBookSDK.getPeers()} />
      </div>
    </HMSThemeProvider>
  );
};

const streams = fakeStreamsWithInfo;

export const DefaultList = Template.bind({});
DefaultList.args = {
  maxTileCount: 3,
  height: '98vh',
  width: '100%',
  classes: {
    //videoTileRoot: 'p-1',
    video: 'rounded-lg shadow-lg',
  },
};

export const CenterStage = Template.bind({});
CenterStage.args = {
  maxTileCount: 2,
  overflow: 'hidden',
  audioLevelDisplayType: 'border',
  height: '98vh',
  width: '100%',
  classes: {
    videoTile: 'p-2',
    video: 'rounded-lg shadow-lg',
  },
};

export const Campfire = Template.bind({});
Campfire.args = {
  maxTileCount: 5,
  showAudioLevel: false,
  displayShape: 'circle',
  height: '200px',
  width: '100%',
  classes: {
    videoTile: 'p-2',
    video: 'rounded-lg shadow-lg',
    root: 'bg-gray-100 rounded-lg',
  },
  showAudioMuteStatus: false,
};

export const SideBar = Template.bind({});
SideBar.args = {
  showAudioLevel: false,
  classes: {
    videoTile: 'p-1',
    video: 'rounded-lg shadow-lg',
  },
};
const GoogleMeetControls = ({
  allowRemoteMute,
  isAudioMuted,
  peer,
  showAudioLevel,
  showAudioMuteStatus,
  audioLevel,
  hmsVideoTrack,
}: {
  allowRemoteMute: boolean;
  isAudioMuted?: boolean;
  peer: HMSPeer;
  showAudioLevel: boolean;
  showAudioMuteStatus: boolean;
  audioLevel?: number;
  hmsVideoTrack?: HMSTrack;
}) => {
  return (
    <>
      {allowRemoteMute && (
        <div className="inset-center">
          <div className="rounded-full text-white py-3 px-4 opacity-40 bg-gray-300 hover:opacity-70 ">
            {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
          </div>
        </div>
      )}
      <VideoTileControls
        label={getVideoTileLabel(
          peer.name,
          peer.isLocal || false,
          hmsVideoTrack?.source,
        )}
        isAudioMuted={isAudioMuted}
        showAudioMuteStatus={showAudioMuteStatus}
        showGradient={false}
        allowRemoteMute={allowRemoteMute}
        showAudioLevel={showAudioLevel}
        audioLevelDisplayType="inline-wave"
        audioLevel={audioLevel}
      />
      ;
    </>
  );
};

const MeetTemplate: Story<VideoListStoryProps> = (
  args: VideoListStoryProps,
) => {
  const peers = storyBookSDK.getPeers();
  return (
    <HMSThemeProvider
      appBuilder={{
        theme: 'dark',
        videoTileAspectRatio: {
          width: 1,
          height: 1,
        },
      }}
      config={{}}
    >
      <div className="h-screen w-full flex flex-wrap justify-center content-evenly justify-items-center">
        <div style={{ width: args.width, height: args.height }} className="p-8">
          {
            <VideoList
              {...args}
              peers={peers}
              videoTileControls={peers.map(peer => (
                <GoogleMeetControls
                  allowRemoteMute={false}
                  peer={peer}
                  showAudioLevel={true}
                  showAudioMuteStatus={true}
                />
              ))}
            />
          }
        </div>
      </div>
    </HMSThemeProvider>
  );
};

export const GoogleMeet = MeetTemplate.bind({});
GoogleMeet.args = {
  //@ts-expect-error
  streams: streams,
  maxTileCount: 6,
  overflow: 'hidden',
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: true,
  audioLevelDisplayType: 'inline-wave',
  allowRemoteMute: false,
  height: '100vh',
  width: '100%',
  showAudioMuteStatus: true,
};
