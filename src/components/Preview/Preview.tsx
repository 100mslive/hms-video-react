import React, { useEffect, useState, useCallback } from 'react';
import { closeMediaStream } from '../../utils';
import { getLocalStreamException, getUserMedia } from '../../utils/preview';
import { VideoTile, VideoTileProps } from '../VideoTile';
import { VideoTileControls } from './Controls';
import { MessageModal } from '../MessageModal';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { Button } from '../TwButton';
import HMSLogger from '../../utils/ui-logger';
import { SettingsFormProps } from '../Settings/Settings';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Text } from '../Text/index';
import { Input } from '../Input';
interface JoinInfo {
  audioMuted?: boolean;
  videoMuted?: boolean;
  name?: string;
}
export interface PreviewClasses {
  root?: string;
  containerRoot?: string;
  header?: string;
  messageModal?: string;
  helloDiv?: string;
  nameDiv?: string;
  inputRoot?: string;
  joinButton?: string;
  goBackButton?: string;
}
const defaultClasses: PreviewClasses = {
  root:
    'flex h-screen w-screen bg-white dark:bg-black justify-center items-center',
  containerRoot:
    'flex flex-col items-center w-37.5 h-400 box-border bg-gray-700 dark:bg-gray-100 text-gray-100 dark:text-white overflow-hidden rounded-2xl',
  header: 'w-22.5 h-22.5 mt-1.875 mb-7',
  helloDiv: 'text-2xl font-medium mb-2',
  nameDiv: 'text-lg leading-6 mb-2',
  inputRoot: 'w-1/3 p-2 mb-3 ',
};
export interface PreviewProps {
  joinOnClick: ({ audioMuted, videoMuted, name }: JoinInfo) => void;
  onChange: (values: SettingsFormProps) => void;
  goBackOnClick: () => void;
  toggleMute: (type: 'audio' | 'video') => void;
  videoTileProps: Partial<VideoTileProps>;
  videoTileClasses?: VideoTileClasses;
  /**
   * extra classes added  by user
   */
  classes?: PreviewClasses;
}

export const Preview = ({
  joinOnClick,
  goBackOnClick,
  onChange,
  videoTileProps,
  classes,
  videoTileClasses,
}: PreviewProps) => {
  const parseClass = useCallback(
    hmsUiClassParserGenerator<PreviewClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-preview',
    }),
    [],
  );
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
  const [selectedAudioInput, setSelectedAudioInput] = useState('default');
  const [selectedVideoInput, setSelectedVideoInput] = useState('default');
  const [name, setName] = useState('');

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
      getUserMedia({
        audio: { deviceId: selectedAudioInput },
        video: { deviceId: selectedVideoInput },
      })
        .then((stream: MediaStream) => setMediaStream(stream))
        .catch((error: any) => {
          HMSLogger.e('[Preview]', error);
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

  useEffect(() => {
    startMediaStream();
  }, [selectedAudioInput, selectedVideoInput]);

  const handleDeviceChange = useCallback((values: SettingsFormProps) => {
    values?.selectedAudioInput &&
      setSelectedAudioInput(values.selectedAudioInput);
    values?.selectedVideoInput &&
      setSelectedVideoInput(values.selectedVideoInput);
    onChange(values);
  }, []);

  return (
    // root
    <div className={parseClass('root')}>
      <div className={parseClass('containerRoot')}>
        {/* header */}
        <div className={parseClass('header')}>
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
                audioButtonOnClick={() => toggleMediaState('audio')}
                videoButtonOnClick={() => toggleMediaState('video')}
                isAudioMuted={audioMuted}
                isVideoMuted={videoMuted}
                onChange={handleDeviceChange}
              />
            }
          />
        </div>
        {/* helloDiv */}
        <div className={parseClass('helloDiv')}>Hi There</div>
        {/* nameDiv */}
        <div className={parseClass('nameDiv')}>What's your name?</div>
        {/* inputFieldRoot */}
        <div className={parseClass('inputRoot')}>
          <Input
            compact
            onChange={e => {
              setName(e.target.value);
            }}
            value={name}
            required
          ></Input>
        </div>

        {/* joinButton */}
        <Button
          variant={'emphasized'}
          size={'lg'}
          onClick={() => {
            closeMediaStream(mediaStream);
            joinOnClick({ audioMuted, videoMuted, name });
          }}
        >
          Join
        </Button>
        <Button
          classes={{ rootNoFill: 'mt-3 text-brand-main' }}
          variant={'no-fill'}
          onClick={() => {
            closeMediaStream(mediaStream);
            goBackOnClick();
          }}
        >
          Go back{' '}
        </Button>
      </div>
    </div>
  );
};
