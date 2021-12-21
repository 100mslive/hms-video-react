import React, { ChangeEventHandler, useMemo, useState, useEffect } from 'react';
import {
  selectLocalMediaSettings,
  selectDevices,
  selectIsAllowedToPublish,
  selectIsAllowedToSubscribe,
  HMSMediaSettings,
} from '@100mslive/hms-video-store';
import { Button } from '../Button';
import { Text } from '../Text';
import TestAudio from './TestAudio';
import { SettingsIcon, CloseIcon } from '../Icons';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { HMSDialog } from '../Dialog';

interface SettingsClasses {
  root?: string;
  iconContainer?: string;
  dialogRoot?: string;
  dialogContainer?: string;
  dialogInner?: string;
  titleContainer?: string;
  titleIcon?: string;
  titleText?: string;
  formContainer?: string;
  formInner?: string;
  selectLabel?: string;
  selectContainer?: string;
  select?: string;
  selectInner?: string;
  divider?: string;
  errorContainer?: string;
  testAudioContainer?: string;
  gap?: string;
}

export interface SettingsProps {
  classes?: SettingsClasses;
  previewMode?: boolean;
  showModal?: boolean;
  onModalClose?: () => void;
  className?: string;
}

const defaultClasses: SettingsClasses = {
  iconContainer: 'focus:outline-none mr-3 hover:bg-gray-200 p-2 rounded-lg',
  dialogRoot: 'rounded-xl ',
  dialogContainer:
    'bg-white text-gray-100 dark:bg-gray-100 dark:text-white w-full p-2 overflow-y-auto rounded-xl',
  dialogInner: 'text-2xl p-2 flex justify-between',
  titleContainer: 'flex items-center',
  titleIcon: 'pr-4',
  titleText: 'text-2xl leading-7',
  formContainer: 'flex flex-wrap p-3 pt-0 md:p-0 text-base md:mb-0',
  formInner: 'w-full flex flex-col md:flex-row my-1.5',
  selectLabel: 'w-full md:w-1/3 flex justify-start md:justify-end items-center',
  selectContainer:
    'rounded-lg w-full md:w-1/2 bg-gray-600 dark:bg-gray-200 p-2 mx-0 my-2 md:my-0 md:mx-2',
  select:
    'rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none',
  selectInner: 'p-4',
  divider: 'bg-gray-600 dark:bg-gray-200 h-px w-full my-4',
  gap: 'w-full pt-4',
  errorContainer: 'flex justify-center items-center w-full px-8 py-4',
  testAudioContainer: 'mx-0 my-2 md:my-0 md:mx-2',
};

const customClasses: SettingsClasses = {
  dialogContainer: 'no-scrollbar ',
};

//TODO split button and settings dialog

export const Settings = ({
  classes,
  showModal,
  onModalClose = () => {},
  className = '',
}: SettingsProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<SettingsClasses>({
        tw,
        classes,
        customClasses,
        defaultClasses,
        tag: 'hmsui-settings',
      }),
    [],
  );

  const hmsActions = useHMSActions();
  const devices = useHMSStore(selectDevices);
  const selectedDevices = useHMSStore(selectLocalMediaSettings);
  const { video: showVideo, audio: showAudio } = useHMSStore(
    selectIsAllowedToPublish,
  );
  const isSubscribing = useHMSStore(selectIsAllowedToSubscribe);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (showModal === undefined) {
      return;
    }
    setOpen(showModal);
  }, [showModal]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onModalClose();
  };

  const handleInputChange: ChangeEventHandler<any> = event => {
    const selectedDevice = event.currentTarget.value;
    const name = event.currentTarget.name;
    if (selectedDevice !== selectedDevices[name as keyof HMSMediaSettings]) {
      switch (name) {
        case 'audioInputDeviceId':
          hmsActions.setAudioSettings({ deviceId: selectedDevice });
          break;
        case 'videoInputDeviceId':
          hmsActions.setVideoSettings({ deviceId: selectedDevice });
          break;
        case 'audioOutputDeviceId':
          hmsActions.setAudioOutputDevice(selectedDevice);
          break;
        default:
          break;
      }
    }
  };

  const videoInput = devices['videoInput'] || [];
  const audioInput = devices['audioInput'] || [];
  const audioOutput = devices['audioOutput'] || [];
  const showSettings = [showVideo, showAudio, audioOutput.length > 0].some(
    val => !!val,
  );
  if (!showSettings) {
    return null;
  }

  return (
    <>
      <Button
        iconOnly
        active={open}
        variant="no-fill"
        iconSize="md"
        onClick={handleClickOpen}
        className={className}
      >
        <SettingsIcon />
      </Button>
      <HMSDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={`${styler('dialogRoot')}`}
        maxWidth="sm"
      >
        <div className={`${styler('dialogContainer')}`}>
          <div className={`${styler('dialogInner')}`}>
            <span className={`${styler('titleContainer')}`}>
              <span className={`${styler('titleIcon')}`}>
                <SettingsIcon className="w-7 h-7" />
              </span>
              <Text variant="heading">Settings</Text>
            </span>

            <Button
              iconOnly
              variant={'no-fill'}
              iconSize="md"
              onClick={handleClose}
            >
              <CloseIcon className="text-gray-400" />
            </Button>
          </div>

          <div className={styler('divider')}></div>

          <div className={`${styler('formContainer')}`}>
            {error === '' ? (
              <>
                {showVideo && (
                  <div className={`${styler('formInner')}`}>
                    <div className={`${styler('selectLabel')}`}>
                      <Text variant="heading" size="sm">
                        Camera:
                      </Text>
                    </div>
                    <div className={`${styler('selectContainer')}`}>
                      {videoInput.length > 0 && (
                        <select
                          name="videoInputDeviceId"
                          className={`${styler('select')}`}
                          onChange={handleInputChange}
                          value={selectedDevices.videoInputDeviceId}
                        >
                          {videoInput.map((device: MediaDeviceInfo) => (
                            <option
                              value={device.deviceId}
                              className={`${styler('selectInner')}`}
                              key={device.deviceId}
                            >
                              {device.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
                {showAudio && (
                  <div className={`${styler('formInner')}`}>
                    <div className={`${styler('selectLabel')}`}>
                      <Text variant="heading" size="sm">
                        Microphone:
                      </Text>
                    </div>

                    <div className={`${styler('selectContainer')}`}>
                      {audioInput.length > 0 && (
                        <select
                          name="audioInputDeviceId"
                          className={`${styler('select')}`}
                          onChange={handleInputChange}
                          value={selectedDevices.audioInputDeviceId}
                        >
                          {audioInput.map((device: MediaDeviceInfo) => (
                            <option
                              value={device.deviceId}
                              className={`${styler('selectInner')}`}
                              key={device.deviceId}
                            >
                              {device.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                )}
                {/** Enabled this when the output is handled properly */}
                {audioOutput.length > 0 && (
                  <>
                    <div className={`${styler('formInner')}`}>
                      <div className={`${styler('selectLabel')}`}>
                        <Text variant="heading" size="sm">
                          Speaker:
                        </Text>
                      </div>
                      <div className={`${styler('selectContainer')}`}>
                        <select
                          name="audioOutputDeviceId"
                          className={`${styler('select')}`}
                          onChange={handleInputChange}
                          value={selectedDevices.audioOutputDeviceId}
                        >
                          {audioOutput.map((device: MediaDeviceInfo) => (
                            <option
                              value={device.deviceId}
                              className={`${styler('select')}`}
                              key={device.deviceId}
                            >
                              {device.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={`${styler('formInner')}`}>
                      <div className={`${styler('selectLabel')}`}>
                        <Text variant="heading" size="sm">
                          Test Audio Level:
                        </Text>
                      </div>
                      <div className={`${styler('testAudioContainer')}`}>
                        <TestAudio
                          outputDeviceId={selectedDevices.audioOutputDeviceId}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className={styler('errorContainer')}>
                Error in accessing devices. Please check permissions. Are all
                devices plugged in?
              </div>
            )}
            <div className={styler('gap')} />
          </div>
        </div>
      </HMSDialog>
    </>
  );
};
