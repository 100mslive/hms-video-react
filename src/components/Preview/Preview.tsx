import React, { useEffect, useState } from 'react';
import { closeMediaStream } from '../../utils';
import { getLocalStreamException, getUserMedia } from '../../utils/preview';
import { VideoTile, VideoTileProps } from '../VideoTile';
import { VideoTileControls } from './Controls';
import { MessageModal } from '../MessageModal';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { withClasses } from '../../utils/styles';
import { create } from 'twind';

import { combineClasses } from '../../utils';

interface MuteStatus {
  audioMuted?: boolean;
  videoMuted?: boolean;
}
interface PreviewClasses {
  root?: string;
  header?: string;
  messageModal?: string;

  helloDiv?: string;
  joinButton?: string;
  goBackButton?: string;
}
const defaultClasses: PreviewClasses = {
  root:
    'flex flex-col items-center w-37.5 h-400 box-border bg-gray-100 text-white overflow-hidden rounded-2xl',
  header: 'w-22.5 h-22.5 mt-1.875 mb-7',
  helloDiv: 'text-2xl font-medium mb-12',
  joinButton:
    'flex justify-center items-center w-8.75 h-3.25 mb-1.625 py-0.875 px-5 bg-blue-main rounded-xl text-lg font-semibold cursor-pointer',
  goBackButton: 'text-blue-main text-lg font-semibold cursor-pointer',
};
interface StyledPreviewProps {
  name: string;
  joinOnClick: ({ audioMuted, videoMuted }: MuteStatus) => void;
  goBackOnClick: () => void;
  toggleMute: (type: 'audio' | 'video') => void;
  videoTileProps: Partial<VideoTileProps>;
  videoTileClasses?: VideoTileClasses;
  /**
   * default classes
   */
  defaultClasses?: PreviewClasses;
  /**
   * extra classes added  by user
   */
  classes?: PreviewClasses;
}

const StyledPreview = ({
  name,
  joinOnClick,
  goBackOnClick,
  videoTileProps,
  classes: extraClasses,
  defaultClasses,
  videoTileClasses,
}: StyledPreviewProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [mediaStream, setMediaStream] = useState(new MediaStream());
  const [errorState, setErrorState] = useState(false);
  const [title, setErrorTitle] = useState(String);
  const [message, setErrorMessage] = useState(String);
  const [secondaryMessage, setSecondaryErrorMessage] = useState(String);
  const [videoInput, setVideoInput] = useState(Array);
  const [audioInput, setAudioInput] = useState(Array);
  const [audioOutput, setAudioutput] = useState(Array);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);

  useEffect(() => {
    startMediaStream();
    return () => closeMediaStream(mediaStream);
  }, []);

  const toggleMediaState = (type: string) => {
    if (type === 'audio') {
      if (!audioMuted) {
        mediaStream.getAudioTracks()[0].enabled = false;
        //TODO add handling for green light later
        //mediaStream.getAudioTracks()[0].stop();
      } else {
        mediaStream.getAudioTracks()[0].enabled = true;
        //startMediaStream();
      }
      setAudioMuted(prevMuted => !prevMuted);
      //toggleMute('audio');
    } else if (type === 'video') {
      if (!videoMuted) {
        mediaStream.getVideoTracks()[0].enabled = false;
        //mediaStream.getVideoTracks()[0].stop();
      } else {
        mediaStream.getVideoTracks()[0].enabled = true;
        //startMediaStream();
      }
      setVideoMuted(prevMuted => !prevMuted);
      //toggleMute('video');
    }
  };
  const agent = navigator.userAgent.toLowerCase();
  const chrome = agent.indexOf('chrome') > -1;
  const safari = agent.indexOf('safari') !== -1 && !chrome;
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const sayswho = (function() {
    var ua = navigator.userAgent,
      tem,
      M =
        ua.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i,
        ) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return `IE ${tem[1] || ''}`;
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        return tem
          .slice(1)
          .join(' ')
          .replace('OPR', 'Opera');
      }
    }
    M = M[2] ? [M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    return M;
  })();
  const [allow, setAllow] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(errorState);
  }, [errorState]);

  const startMediaStream = () => {
    console.log('MEDIA STREAM STARTED');
    console.log(`Version: ${sayswho}`);
    if (chrome && isIOS) {
      var errorMessage = getLocalStreamException('iOSChromeError', true);
      setErrorTitle(errorMessage['title']);
      setErrorMessage(errorMessage['message']);
      setSecondaryErrorMessage(errorMessage['secondaryMessage']);
      setErrorState(true);
      setAllow(false);
    } else if (safari && parseInt(sayswho as string) < 14) {
      errorMessage = getLocalStreamException('iOSSafariError', true);
      setErrorTitle(errorMessage['title']);
      setErrorMessage(errorMessage['message']);
      setSecondaryErrorMessage(errorMessage['secondaryMessage']);
      setErrorState(true);
      setAllow(false);
    } else {
      // window.navigator.mediaDevices
      getUserMedia({ audio: true, video: true })
        .then((stream: MediaStream) => setMediaStream(stream))
        .catch((error: any) => {
          console.log(error);
          if (
            error.name === 'NotAllowedError' ||
            error.error === 'NotAllowedError'
          ) {
            var errorMessage = getLocalStreamException(error.name, safari);
            setErrorTitle(errorMessage['title']);
            setErrorMessage(errorMessage['message']);
            setSecondaryErrorMessage(errorMessage['secondaryMessage']);
            setErrorState(true);
          } else {
            navigator.mediaDevices
              .enumerateDevices()
              .then(devices => {
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
                  var errorMessage = getLocalStreamException(
                    error.name,
                    safari,
                  );
                  setErrorTitle(errorMessage['title']);
                  setErrorMessage(errorMessage['message']);
                  setSecondaryErrorMessage(errorMessage['secondaryMessage']);
                  setErrorState(true);
                } else {
                  errorMessage = getLocalStreamException(error.name, safari);
                  setErrorTitle(errorMessage['title']);
                  setErrorMessage(errorMessage['message']);
                  setSecondaryErrorMessage(errorMessage['secondaryMessage']);
                  setErrorState(true);
                }
              })
              .catch(error => {
                var errorMessage = getLocalStreamException(error.name, safari);
                setErrorTitle(errorMessage['title']);
                setErrorMessage(errorMessage['message']);
                setSecondaryErrorMessage(errorMessage['secondaryMessage']);
                setErrorState(true);
              });
          }
        });
    }
  };

  window.onunload = () => closeMediaStream(mediaStream);

  return (
    // root
    <div className={combinedClasses?.root}>
      {/* header */}
      <div className={combinedClasses?.header}>
        {/* messageModal */}
        <MessageModal
          show={showModal}
          setShow={setShowModal}
          title={title}
          message={message}
          secondary={secondaryMessage}
          allow={allow}
          gobackOnClick={goBackOnClick}
        />
        {/* videoTile */}
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
          classes={videoTileClasses}
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
      {/* helloDiv */}
      <div className={combinedClasses?.helloDiv}>Hello, {name}</div>
      {/* joinButton */}
      <div
        className={combinedClasses?.joinButton}
        onClick={() => {
          closeMediaStream(mediaStream);
          joinOnClick({ audioMuted, videoMuted });
        }}
      >
        Join
      </div>
      {/* goBackButton */}
      <div
        className={combinedClasses?.goBackButton}
        onClick={() => {
          closeMediaStream(mediaStream);
          goBackOnClick();
        }}
      >
        Go back
      </div>
    </div>
  );
};

export type PreviewProps = Omit<StyledPreviewProps, 'defaultClasses'>;

export const Preview = withClasses<PreviewClasses | undefined>(
  defaultClasses,
  'preview',
  create().tw,
)<StyledPreviewProps>(StyledPreview);
