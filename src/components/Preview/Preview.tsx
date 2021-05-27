import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import startCase from 'lodash/startCase';
import { closeMediaStream } from '../../utils';
import { getLocalStream } from '@100mslive/100ms-web-sdk';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import {
  BrowserOSError,
  getLocalStreamException,
  isBrowserOSValid,
} from '../../utils/preview';
import { MessageModal } from '../MessageModal';
import { SettingsFormProps } from '../Settings/Settings';
import { Button } from '../Button';
import { VideoTile, VideoTileProps } from '../VideoTile';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { VideoTileControls } from './Controls';
import HMSLogger from '../../utils/ui-logger';
import { Text } from '../Text';
import { HMSPeer } from '../../store/schema';

interface MuteStatus {
  audioMuted?: boolean;
  videoMuted?: boolean;
}
export interface PreviewClasses {
  root?: string;
  containerRoot?: string;
  header?: string;
  messageModal?: string;
  helloDiv?: string;
  joinButton?: string;
  goBackButton?: string;
}
const defaultClasses: PreviewClasses = {
  root:
    'flex h-screen w-screen bg-white dark:bg-black justify-center items-center',
  containerRoot:
    'flex flex-col items-center w-37.5 h-400 box-border bg-gray-600 dark:bg-gray-100 text-gray-100 dark:text-white overflow-hidden rounded-2xl',
  header: 'w-22.5 h-22.5 mt-1.875 mb-7',
  helloDiv: 'text-2xl font-medium mb-12',
};
export interface PreviewProps {
  name: string;
  joinOnClick: ({ audioMuted, videoMuted }: MuteStatus) => void;
  onChange: (values: SettingsFormProps) => void;
  goBackOnClick: () => void;
  videoTileProps?: Partial<VideoTileProps>;
  videoTileClasses?: VideoTileClasses;
  /**
   * extra classes added  by user
   */
  classes?: PreviewClasses;
}

export const Preview = ({
  name,
  joinOnClick,
  goBackOnClick,
  onChange,
  videoTileProps,
  classes,
  videoTileClasses,
}: PreviewProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<PreviewClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-preview',
      }),
    [],
  );
  const [mediaStream, setMediaStream] = useState(new MediaStream());
  const [error, setError] = useState({
    title: '',
    message: '',
  });
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [selectedAudioInput, setSelectedAudioInput] = useState('default');
  const [selectedVideoInput, setSelectedVideoInput] = useState('default');

  const toggleMediaState = (type: string) => {
    if (type === 'audio') {
      mediaStream.getAudioTracks()[0].enabled = audioMuted;
      setAudioMuted(prevMuted => !prevMuted);
    } else if (type === 'video') {
      mediaStream.getVideoTracks()[0].enabled = videoMuted;
      setVideoMuted(prevMuted => !prevMuted);
    }
  };

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    setShowModal(Boolean(error.title));
  }, [error.title]);

  const startMediaStream = async () => {
    closeMediaStream(mediaStream);
    try {
      if (isBrowserOSValid()) {
        const stream = await getLocalStream({
          audio: { deviceId: selectedAudioInput },
          video: { deviceId: selectedVideoInput },
        });
        setMediaStream(stream);
      }
    } catch (err) {
      HMSLogger.e('[Preview]', err.name, err.message);
      if (err instanceof BrowserOSError) {
        const localStreamError = getLocalStreamException(err.name);
        setError(localStreamError);
      } else {
        setError({
          title: startCase(err.title),
          message: err.message,
        });
      }
    }
  };

  window.onunload = () => closeMediaStream(mediaStream);

  useEffect(() => {
    startMediaStream();
    return () => {
      closeMediaStream(mediaStream);
    };
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
    <div className={styler('root')}>
      <div className={styler('containerRoot')}>
        {/* header */}
        <div className={styler('header')}>
          {/* messageModal */}
          <MessageModal
            show={showModal}
            setShow={setShowModal}
            title={error.title}
            message={error.message}
            allow={false}
            gobackOnClick={goBackOnClick}
          />
          {/* videoTile */}
          <VideoTile
            {...videoTileProps}
            videoTrack={mediaStream.getVideoTracks()[0]}
            isAudioMuted={audioMuted}
            isVideoMuted={videoMuted}
            audioTrack={mediaStream.getAudioTracks()[0]}
            peer={
              {
                id: name,
                name: name,
                isLocal: true,
              } as HMSPeer
            }
            objectFit="cover"
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
        <div className={styler('helloDiv')}>
          <Text variant="heading">Hello, {name}</Text>
        </div>
        {/* joinButton */}
        <Button
          variant={'emphasized'}
          size={'lg'}
          onClick={() => {
            closeMediaStream(mediaStream);
            joinOnClick({ audioMuted, videoMuted });
          }}
        >
          Join
        </Button>
        <Button
          classes={{ rootNoFill: 'mt-4 text-brand-main' }}
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
