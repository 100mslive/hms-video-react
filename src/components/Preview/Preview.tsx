import React, { useEffect, useState } from 'react';
import { closeMediaStream, getLocalStreamException } from '../../utils';
import { VideoTile, VideoTileProps } from '../VideoTile';
import { VideoTileControls } from './Controls';
import { MessageModal } from '../MessageModal';

export interface PreviewProps {
  name: string;
  joinOnClick: () => void;
  goBackOnClick: () => void;
  messageOnClose: () => void;
  toggleMute: (type: 'audio' | 'video') => void;
  videoTileProps: Partial<VideoTileProps>;
}

export const Preview = ({
  name,
  joinOnClick,
  goBackOnClick,
  messageOnClose,
  toggleMute,
  videoTileProps,
}: PreviewProps) => {
  const [mediaStream, setMediaStream] = useState(new MediaStream());
  const [errorState, setErrorState] = useState(false);
  const [title, setErrorTitle] = useState(String);
  const [message, setErrorMessage] = useState(String);
  const [videoInput, setVideoInput] = useState(Array);
  const [audioInput, setAudioInput] = useState(Array);
  const [audioOutput, setAudioutput] = useState(Array);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  useEffect(() => {
    if (name) {
      startMediaStream();
    }
    return () => closeMediaStream(mediaStream);
  }, []);

  useEffect(() => {
    mediaStream &&
      mediaStream.getAudioTracks().length > 0 &&
      toggleEnabled(mediaStream.getAudioTracks()[0], !audioMuted);
  }, [audioMuted]);

  useEffect(() => {
    if (videoMuted) {
      console.log('VIDEO IS NOW MUTED');
      closeMediaStream(mediaStream);
    } else {
      console.log('VIDEO IS NOW UNMUTED');
      startMediaStream();
      mediaStream &&
        mediaStream.getVideoTracks().length > 0 &&
        toggleEnabled(mediaStream.getVideoTracks()[0], !videoMuted);
    }
  }, [videoMuted]);

  const toggleMediaState = (type: string) => {
    if (type === 'audio') {
      setAudioMuted(prevMuted => !prevMuted);
      toggleMute('audio');
    } else if (type === 'video') {
      setVideoMuted(prevMuted => !prevMuted);
      toggleMute('video');
    }
  };

  const toggleEnabled = (track: MediaStreamTrack, enabled: boolean) => {
    track.enabled = enabled;
  };

  const startMediaStream = () => {
    window.navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(stream => setMediaStream(stream))
      .catch(error => {
        if (error.name === 'NotAllowedError') {
          setErrorState(true);
          const errorMessage = getLocalStreamException(error);
          setErrorTitle(errorMessage['title']);
          setErrorMessage(errorMessage['message']);
        } else {
          navigator.mediaDevices.enumerateDevices().then(devices => {
            for (let device of devices) {
              if (device.kind === 'videoinput') {
                setVideoInput(videoDevices => [...videoDevices, device]);
              } else if (device.kind === 'audioinput') {
                setAudioInput([...audioInput, device]);
              } else if (device.kind === 'audiooutput') {
                setAudioutput([...audioOutput, device]);
              }
            }
            if (videoInput.length === 0 || audioInput.length === 0) {
              error.name = 'NotFoundError';
              const errorMessage = getLocalStreamException(error);
              setErrorTitle(errorMessage['title']);
              setErrorMessage(errorMessage['message']);
              setErrorState(true);
            } else {
              const errorMessage = getLocalStreamException(error);
              setErrorTitle(errorMessage['title']);
              setErrorMessage(errorMessage['message']);
              setErrorState(true);
            }
          });
        }
      });
  };

  return (
    <div className="flex flex-col items-center w-37.5 h-400 box-border bg-gray-100 text-white overflow-hidden rounded-2xl">
      <div className="w-22.5 h-22.5 mt-1.875 mb-7">
        <MessageModal
          show={errorState}
          title={title}
          message={message}
          onClose={messageOnClose}
        />
        <VideoTile
          {...videoTileProps}
          videoTrack={mediaStream.getVideoTracks()[0]}
          audioTrack={mediaStream.getAudioTracks()[0]}
          peer={{
            id: name,
            displayName: name,
          }}
          objectFit="cover"
          isLocal={true}
          aspectRatio={{
            width: 1,
            height: 1,
          }}
          controlsComponent={
            <VideoTileControls
              settingsButtonOnClick={() =>
                console.log('Settings Component yet to be made')
              }
              audioButtonOnClick={() => toggleMediaState('audio')}
              videoButtonOnClick={() => toggleMediaState('video')}
              isAudioMuted={audioMuted}
              isVideoMuted={videoMuted}
            />
          }
        />
      </div>
      <div className="text-2xl font-medium mb-12">Hello, {name}</div>
      <div
        className="flex justify-center items-center w-8.75 h-3.25 mb-1.625 py-0.875 px-5 bg-blue-main rounded-xl text-lg font-semibold cursor-pointer"
        onClick={() => {
          joinOnClick();
          closeMediaStream(mediaStream);
        }}
      >
        Join
      </div>
      <div
        className="text-blue-main text-lg font-semibold cursor-pointer"
        onClick={() => {
          goBackOnClick();
          closeMediaStream(mediaStream);
        }}
      >
        Go back
      </div>
    </div>
  );
};
