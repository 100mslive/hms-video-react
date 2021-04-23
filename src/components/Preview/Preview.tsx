import React, { ReactNodeArray, useEffect, useState } from 'react';
import { closeMediaStream } from '../../utils';
import { VideoTile, VideoTileProps } from '../VideoTile';

export interface PreviewProps extends VideoTileProps {
  name: string,
  joinOnClick: () => void;
  goBackOnClick: () => void;
  videoTileProps: VideoTileProps
}

export const Preview = ({
  name,
  joinOnClick,
  goBackOnClick,
  videoTileProps
}: PreviewProps) => {

  const [mediaStream, setMediaStream] = useState(new MediaStream());

  useEffect(() => {
    window.navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => setMediaStream(stream));
    return (() => closeMediaStream(mediaStream));
  }, []);

  return (
    <div className="flex flex-col items-center w-37.5 h-400 box-border bg-gray-100 text-white overflow-auto rounded-2xl font-inter">
      <div className="w-22.5 h-22.5 mt-1.875 mb-7">
        <VideoTile
          videoTrack={mediaStream.getVideoTracks()[0]}
          audioTrack={mediaStream.getAudioTracks()[0]}
          peer={{
            id: name,
            displayName: name
          }}
          objectFit="cover"
          isLocal={true}
          aspectRatio={{
            width: 1,
            height: 1
          }}
        //@ts-ignore
        // classes={{root: "'w-full h-full flex relative items-center justify-center rounded-lg"}}
        />
      </div>
      <div className="text-2xl font-medium mb-12">Hello, {name}</div>
      <div
        className="flex justify-center items-center w-8.75 h-3.25 mb-1.625 py-0.875 px-5 bg-blue-main rounded-xl text-lg font-semibold cursor-pointer"
        onClick={joinOnClick}
      >
        Join
      </div>
      <div
        className="text-blue-main text-lg font-semibold cursor-pointer"
        onClick={goBackOnClick}
      >
        Go back
      </div>
    </div>
  )
};
