import { Meta, Story } from '@storybook/react';
import React, { useState, useEffect, useRef } from 'react';
import { VideoTile, VideoTileProps } from '.';
import VideoTileDocs from './VideoTile.mdx';
import { getVideoTileLabel } from '../../utils';
import { loadStream } from '../../storybook/utils';
import { VideoTileControls } from './Controls';
import { MicOffIcon, MicOnIcon } from '../../icons';

declare global {
  interface HTMLVideoElement {
    captureStream(frameRate?: number): MediaStream;
  }
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
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

  // useEffect(() => {
  //   // if (testVideoRef.current && stream) {
  //   //   testVideoRef.current.srcObject = stream;
  //   // }
  // }, [stream]);

  useEffect(() => {
    if (dummyVideoRef) {
      return loadStream({
        videoTrack,
        audioTrack,
        isLocal: args.isLocal,
        videoSource: args.videoSource,
        dummyVideoRef,
        setVideoTrack,
        setAudioTrack,
      });
    } else {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.videoSource, args.isLocal]);

  return (
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
      {videoTrack && audioTrack && (
        <VideoTile {...args} videoTrack={videoTrack} audioTrack={audioTrack} />
      )}
    </div>
  );
};

const MeetTemplate: Story<VideoTileProps> = args => {
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>();
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>();
  const dummyVideoRef = useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   const track = stream?.getVideoTracks()[0];
  //   if (track) {
  //     track.enabled = !args.isVideoMuted;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [args.isVideoMuted]);

  // useEffect(() => {
  //   const track = stream?.getAudioTracks()[0];
  //   if (track) {
  //     track.enabled = !args.isAudioMuted;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [args.isAudioMuted]);

  useEffect(() => {
    if (dummyVideoRef) {
      return loadStream({
        videoTrack,
        audioTrack,
        isLocal: args.isLocal,
        videoSource: args.videoSource,
        dummyVideoRef,
        setVideoTrack,
        setAudioTrack,
      });
    } else {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.videoSource, args.isLocal]);

  return (
    <>
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
        {videoTrack && audioTrack && (
          <VideoTile
            {...args}
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
    </>
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
  classes: { root: 'hello' },
};

GoogleMeetVideoTile.args = {
  isLocal: true,
  peer: { id: '123', displayName: 'Eswar' },
  aspectRatio: { width: 16, height: 9 },
  displayShape: 'rectangle',
  showAudioLevel: true,
  audioLevelDisplayType: 'inline-wave',
  audioLevel: 40,
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
