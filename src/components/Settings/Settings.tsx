import React, { ChangeEventHandler, useEffect, useMemo, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import {
  selectLocalMediaSettings,
  selectDevices,
  selectIsAllowedToPublish,
  selectIsAllowedToSubscribe,
  HMSMediaSettings,
} from '@100mslive/hms-video-store';
import { Button as TwButton } from '../Button';
import { Text } from '../Text';
import { SettingsIcon, CloseIcon } from '../Icons';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { isMobileDevice } from '../../utils';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Slider } from '../Slider/Slider';
import TestAudio from './TestAudio';

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
  sliderContainer?: string;
  sliderInner?: string;
  sliderLabelContainer?: string;
  sliderLabel?: string;
  slider?: string;
  errorContainer?: string;
  testAudioContainer?: string;
  gap?: string;
}

export interface SettingsProps {
  classes?: SettingsClasses;
  onTileCountChange?: (count: number) => void;
  maxTileCount?: number;
  previewMode?: boolean;
}

const defaultClasses: SettingsClasses = {
  iconContainer: 'focus:outline-none mr-3 hover:bg-gray-200 p-2 rounded-lg',
  dialogRoot: 'rounded-xl ',
  dialogContainer:
    'bg-white text-gray-100 dark:bg-gray-100 dark:text-white w-full p-2 overflow-y-auto rounded-xl',
  dialogInner: 'text-2xl mb-3 p-2 flex justify-between',
  titleContainer: 'flex items-center',
  titleIcon: 'pr-4',
  titleText: 'text-2xl leading-7',
  formContainer: 'flex flex-wrap text-base mb-2 md:mb-0',
  formInner: 'w-full flex my-1.5',
  selectLabel: 'w-1/3 flex justify-end items-center',
  selectContainer: 'rounded-lg w-1/2 bg-gray-600 dark:bg-gray-200 p-2 mx-2',
  select:
    'rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none',
  selectInner: 'p-4',
  divider: 'bg-gray-600 dark:bg-gray-200 h-px w-full my-4',
  gap: 'w-full pt-4',
  sliderContainer: 'w-full my-1.5',
  sliderInner: 'w-full flex',
  sliderLabelContainer: 'w-1/3 flex justify-end items-center ',
  sliderLabel: 'text-right',
  slider: 'rounded-lg w-1/2  p-2 mx-2 flex my-1 items-center ',
  errorContainer: 'flex justify-center items-center w-full px-8 py-4',
  testAudioContainer: 'mx-2',
};

const customClasses: SettingsClasses = {
  dialogContainer: 'no-scrollbar ',
};

const HMSDialog = withStyles({
  paper: {
    borderRadius: '12px',
    backgroundColor: 'inherit',
  },
})(Dialog);
//TODO split button and settings dialog

export const Settings = ({
  classes,
  onTileCountChange = () => {},
  maxTileCount = 9,
  previewMode = false,
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    //TODO make this generic
    if (typeof newValue === 'number') {
      onTileCountChange(newValue);
    }
  };

  const videoInput = devices['videoInput'] || [];
  const audioInput = devices['audioInput'] || [];
  const audioOutput = devices['audioOutput'] || [];
  const showSettings = [showVideo, showAudio, isSubscribing].some(val => !!val);
  if (!showSettings) {
    return null;
  }

  return (
    <>
      <TwButton
        iconOnly
        active={open}
        variant={'no-fill'}
        iconSize="md"
        onClick={handleClickOpen}
      >
        <SettingsIcon />
      </TwButton>
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

            <TwButton
              iconOnly
              variant={'no-fill'}
              iconSize="md"
              onClick={handleClose}
            >
              <CloseIcon className="text-gray-400" />
            </TwButton>
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
                          {videoInput.map((device: InputDeviceInfo) => (
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
                          {audioInput.map((device: InputDeviceInfo) => (
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
                {isSubscribing && audioOutput.length > 0 && (
                  <>
                    <div className={`${styler('formInner')}`}>
                      <div className={`${styler('selectLabel')}`}>
                        <Text variant="heading" size="sm">
                          Audio Output:
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
            {/** Hide participants view for mobile */}
            {!isMobileDevice() && isSubscribing && !previewMode && (
              <>
                <div className={styler('divider')}></div>
                <div className={styler('sliderContainer')}>
                  <div className={styler('sliderInner')}>
                    <div className={styler('sliderLabelContainer')}>
                      <Text variant="heading" size="sm">
                        Participants in view:
                      </Text>
                    </div>
                    <div className={styler('slider')}>
                      <Slider
                        name="maxTileCount"
                        defaultValue={9}
                        value={maxTileCount}
                        onChange={handleSliderChange}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto"
                        min={1}
                        max={49}
                        step={null}
                        marks={[
                          { value: 1 },
                          { value: 4 },
                          { value: 9 },
                          { value: 16 },
                          { value: 25 },
                          { value: 36 },
                          { value: 49 },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </HMSDialog>
    </>
  );
};
