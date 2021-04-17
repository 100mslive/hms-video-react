import { MediaStreamWithInfo, VideoSource } from '../../types';
import { closeMediaStream } from '../../utils';

const loadStream = (props: {
  stream: MediaStream | undefined;
  dummyVideoRef: React.RefObject<HTMLVideoElement>;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  isLocal?: boolean;
  videoSource?: VideoSource;
}) => {
  const { stream, dummyVideoRef, setStream, isLocal, videoSource } = props;
  //console.log('Closing media stream');
  closeMediaStream(stream);

  if (videoSource === 'camera' && isLocal) {
    window.navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function(stream) {
        //console.log('Updating stream with camera feed', stream);
        setStream(stream);
      });
  } else if (videoSource === 'screen' && isLocal) {
    //console.log('Updating stream with screenshare feed');
    window.navigator.mediaDevices
      // @ts-ignore
      .getDisplayMedia({ video: true })
      .then(function(stream: MediaStream | undefined) {
        setStream(stream);
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
    closeMediaStream(stream);
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
      stream: streamWithInfo.stream,
      dummyVideoRef:
        !streamWithInfo.isLocal && streamWithInfo.videoSource === 'screen'
          ? dummyScreenVideoRef
          : dummyCameraVideoRef,
      setStream: stream => {
        if (stream !== undefined && typeof stream === 'object') {
          let newStreamsWithInfo = [...streamsWithInfo];
          newStreamsWithInfo[index].stream = stream;
          setStreamsWithInfo(newStreamsWithInfo);
        }
      },
      isLocal: streamWithInfo.isLocal,
      videoSource: streamWithInfo.videoSource,
    });
  });
};

export { loadStream, loadStreams };
