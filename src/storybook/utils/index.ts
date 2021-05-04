import { MediaStreamWithInfo, VideoSource } from '../../types';
import { getUserMedia } from '../../utils/preview';
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
  videoSource?: VideoSource;
}) => {
  const {
    videoTrack,
    audioTrack,
    dummyVideoRef,
    setVideoTrack,
    setAudioTrack,
    isLocal,
    videoSource,
  } = props;
  //console.log('Closing media stream');
  videoTrack?.stop();
  audioTrack?.stop();

  if (videoSource === 'camera' && isLocal) {
    // window.navigator.mediaDevices
    getUserMedia({ audio: true, video: true }).then(function(
      stream: MediaStream,
    ) {
      //console.log('Updating stream with camera feed', stream);
      setVideoTrack(stream.getVideoTracks()[0]);
      setAudioTrack(stream.getAudioTracks()[0]);
    });
  } else if (videoSource === 'screen' && isLocal) {
    //console.log('Updating stream with screenshare feed');
    window.navigator.mediaDevices
      // @ts-ignore
      .getDisplayMedia({ video: true })
      .then(function(stream: MediaStream | undefined) {
        setVideoTrack(stream?.getVideoTracks()[0]);
        setAudioTrack(stream?.getAudioTracks()[0]);
      });
  } else if (videoSource === 'screen' && !isLocal) {
    //console.log('Updating stream with remote screenshare feed');
    //console.log('Screen remote');
    dummyVideoRef.current?.setAttribute(
      'src',
      'https://res.cloudinary.com/dlzh3j8em/video/upload/v1618618376/Screen_Recording_2021-04-17_at_5.36.24_AM_if70nz_wl31nt.mp4',
    );
  } else if (!isLocal) {
    //console.log('Updating stream with remote camera feed');
    //console.log('Camera remote');
    //console.log('dummyVideo', dummyVideoRef.current);
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
        !streamWithInfo.isLocal && streamWithInfo.videoSource === 'screen'
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

      isLocal: streamWithInfo.isLocal,
      videoSource: streamWithInfo.videoSource,
    });
  });
};

export { loadStream, loadStreams };
