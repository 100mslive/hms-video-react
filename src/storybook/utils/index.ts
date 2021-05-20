import { MediaStreamWithInfo } from '../../types';
import { getUserMedia } from '../../utils/preview';
import { HMSTrackSource } from '../../store/schema';
import React from 'react';
const loadStream = (props: {
  videoTrack: MediaStreamTrack | undefined;
  audioTrack: MediaStreamTrack | undefined;
  dummyVideoRef: React.RefObject<HTMLVideoElement>;
  setVideoTrack: React.Dispatch<
    React.SetStateAction<MediaStreamTrack | undefined>
  >;
  setAudioTrack: React.Dispatch<
    React.SetStateAction<MediaStreamTrack | undefined>
  >;
  isLocal?: boolean;
  passedVideoSource?: HMSTrackSource;
}) => {
  const {
    videoTrack,
    audioTrack,
    dummyVideoRef,
    setVideoTrack,
    setAudioTrack,
    isLocal,
    passedVideoSource,
  } = props;
  videoTrack?.stop();
  audioTrack?.stop();

  const videoSource = passedVideoSource || 'regular';

  if (videoSource === 'regular' && isLocal) {
    // window.navigator.mediaDevices
    getUserMedia({ audio: true, video: true }).then(function(
      stream: MediaStream,
    ) {
      setVideoTrack(stream.getVideoTracks()[0]);
      setAudioTrack(stream.getAudioTracks()[0]);
    });
  } else if (videoSource === 'screen' && isLocal) {
    window.navigator.mediaDevices
      // @ts-ignore
      .getDisplayMedia({ video: true })
      .then(function(stream: MediaStream | undefined) {
        setVideoTrack(stream?.getVideoTracks()[0]);
        setAudioTrack(stream?.getAudioTracks()[0]);
      });
  } else if (videoSource === 'screen' && !isLocal) {
    dummyVideoRef.current?.setAttribute(
      'src',
      'https://res.cloudinary.com/dlzh3j8em/video/upload/v1618618376/Screen_Recording_2021-04-17_at_5.36.24_AM_if70nz_wl31nt.mp4',
    );
  } else if (!isLocal) {
    dummyVideoRef.current?.setAttribute(
      'src',
      'https://res.cloudinary.com/dlzh3j8em/video/upload/v1618618246/pexels-mart-production-7261921_XCEC2bNM_osJG_lhdtua.mp4',
    );
  }
  return () => {
    videoTrack?.stop();
    audioTrack?.stop();
  };
};

export interface LoadStreamsProps {
  streamsWithInfo: MediaStreamWithInfo[];
  dummyCameraVideoRef: React.RefObject<HTMLVideoElement>;
  dummyScreenVideoRef: React.RefObject<HTMLVideoElement>;
  setStreamsWithInfo: React.Dispatch<
    React.SetStateAction<MediaStreamWithInfo[]>
  >;
}

const loadStreams = ({
  streamsWithInfo,
  dummyCameraVideoRef,
  dummyScreenVideoRef,
  setStreamsWithInfo,
}: LoadStreamsProps) => {
  streamsWithInfo?.forEach((streamWithInfo, index) => {
    loadStream({
      videoTrack: streamWithInfo.videoTrack,
      audioTrack: streamWithInfo.audioTrack,
      dummyVideoRef:
        !streamWithInfo.peer.isLocal && streamWithInfo.hmsVideoTrack?.source === 'screen'
          ? dummyScreenVideoRef
          : dummyCameraVideoRef,
      setVideoTrack: videoTrack => {
        if (videoTrack !== undefined && typeof videoTrack === 'object') {
          let newStreamsWithInfo = [...streamsWithInfo];
          newStreamsWithInfo[index].videoTrack = videoTrack;
          setStreamsWithInfo(newStreamsWithInfo);
        }
      },
      setAudioTrack: audioTrack => {
        if (audioTrack !== undefined && typeof audioTrack === 'object') {
          let newStreamsWithInfo = [...streamsWithInfo];
          newStreamsWithInfo[index].audioTrack = audioTrack;
          setStreamsWithInfo(newStreamsWithInfo);
        }
      },

      isLocal: streamWithInfo.peer.isLocal,
    });
  });
};

export { loadStream, loadStreams };
