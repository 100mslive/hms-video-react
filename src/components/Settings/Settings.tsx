import React, { ChangeEventHandler, useMemo, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core/styles';
import { selectLocalMediaSettings } from '@100mslive/hms-video-store';
import { getLocalDevices, getLocalStream } from '@100mslive/hms-video';
import { Button as TwButton } from '../Button';
import { Text } from '../Text';
import { SettingsIcon, CloseIcon } from '../Icons';
import { useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { closeMediaStream, isMobileDevice } from '../../utils';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Slider } from '../Slider/Slider';

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
}

export interface SettingsFormProps {
  selectedVideoInput?: string;
  selectedAudioInput?: string;
  selectedAudioOutput?: string;
  maxTileCount?: number;
}
export interface SettingsProps {
  initialValues?: SettingsFormProps;
  onChange?: (values: SettingsFormProps) => void;
  classes?: SettingsClasses;
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
  sliderContainer: 'w-full my-1.5',
  sliderInner: 'w-full flex',
  sliderLabelContainer: 'w-1/3 flex justify-end items-center ',
  sliderLabel: 'text-right',
  slider: 'rounded-lg w-1/2  p-2 mx-2 flex my-1 items-center ',
  errorContainer: 'flex justify-center items-center w-full px-8 py-4',
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
  onChange,
  initialValues,
  classes,
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

  const storeInitialValues = useHMSStore(selectLocalMediaSettings);

  const [open, setOpen] = useState(false);
  const [deviceGroups, setDeviceGroups] = useState<{
    audioinput: MediaDeviceInfo[];
    audiooutput: MediaDeviceInfo[];
    videoinput: MediaDeviceInfo[];
  }>({
    audioinput: [],
    audiooutput: [],
    videoinput: [],
  });
  const [error, setError] = useState('');

  if (!initialValues) {
    initialValues = {};
  }
  initialValues.selectedVideoInput =
    initialValues.selectedVideoInput || storeInitialValues.videoInputDeviceId;
  initialValues.selectedAudioInput =
    initialValues.selectedAudioInput || storeInitialValues.audioInputDeviceId;
  initialValues.selectedAudioOutput =
    initialValues.selectedAudioOutput || storeInitialValues.audioOutputDeviceId;

  const deviceValues = {
    selectedAudioInput: initialValues.selectedAudioInput || 'default',
    selectedVideoInput: initialValues.selectedVideoInput || 'default',
    selectedAudioOutput: initialValues.selectedAudioOutput || 'default',
  };

  const [values, setValues] = useState<SettingsFormProps>({
    ...deviceValues,
    maxTileCount: initialValues.maxTileCount || 9,
  });

  async function getDevices() {
    try {
      let deviceGroups = await getLocalDevices();
      if (
        Object.values(deviceGroups)
          .flat()
          .every(val => !val.deviceId || !val.label) // deviceid is always present in firefox
      ) {
        // No permissions get permissions now
        const stream = await getLocalStream({ video: true, audio: true });
        closeMediaStream(stream);
        deviceGroups = await getLocalDevices();
      }
      setDeviceGroups(deviceGroups);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (open) {
      getDevices();
    }
  }, [open]);

  const handleClickOpen = () => {
    setOpen(true);
    if (!previewMode) {
      // sync with store on open
      setValues({ ...values, ...deviceValues });
    }
  };

  const handleClose = () => {
    setOpen(false);
    onChange && onChange(values);
  };

  const handleInputChange: ChangeEventHandler<any> = event => {
    const newValues = { ...values };
    newValues[event.currentTarget.name as keyof SettingsFormProps] =
      event.currentTarget.value;
    setValues(newValues);
    onChange && onChange(newValues);
  };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    const newValues = { ...values };
    //TODO make this generic
    if (typeof newValue === 'number') {
      newValues.maxTileCount = newValue;
    }
    setValues(newValues);
  };

  const videoInput = deviceGroups['videoinput'] || [];
  const audioInput = deviceGroups['audioinput'] || [];
  const audioOutput = deviceGroups['audiooutput'] || [];
  //TODO handle case where selected device is not in list
  // audioOutput.length > 0 && audioOutput.findIndex(device => device.deviceId===values?.selectedAudioOutput)===-1 && setValues({selectedAudioOutput:videoInput[0].deviceId});
  // audioInput.length > 0 && audioInput.findIndex(device => device.deviceId===values?.selectedAudioInput)===-1 && setValues({selectedAudioInput:videoInput[0].deviceId});
  // videoInput.length > 0 && videoInput.findIndex(device => device.deviceId===values?.selectedVideoInput)===-1 && setValues({selectedVideoInput:videoInput[0].deviceId});

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
                <div className={`${styler('formInner')}`}>
                  <div className={`${styler('selectLabel')}`}>
                    <Text variant="heading" size="sm">
                      Camera:
                    </Text>
                  </div>
                  <div className={`${styler('selectContainer')}`}>
                    {videoInput.length > 0 && (
                      <select
                        name="selectedVideoInput"
                        className={`${styler('select')}`}
                        onChange={handleInputChange}
                        value={values.selectedVideoInput}
                      >
                        {videoInput.map((device, index) => (
                          <option
                            value={device.deviceId}
                            className={`${styler('selectInner')}`}
                            key={index}
                          >
                            {device.label} {device.deviceId}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className={`${styler('formInner')}`}>
                  <div className={`${styler('selectLabel')}`}>
                    <Text variant="heading" size="sm">
                      Microphone:
                    </Text>
                  </div>

                  <div className={`${styler('selectContainer')}`}>
                    {audioInput.length > 0 && (
                      <select
                        name="selectedAudioInput"
                        className={`${styler('select')}`}
                        onChange={handleInputChange}
                        value={values.selectedAudioInput}
                      >
                        {audioInput.map((device, index) => (
                          <option
                            value={device.deviceId}
                            className={`${styler('selectInner')}`}
                            key={index}
                          >
                            {device.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                {/** Enabled this when the output is handled properly */}
                <div className={`${styler('formInner')}`}>
                  <div className={`${styler('selectLabel')}`}>
                    <Text variant="heading" size="sm">
                      Audio Output:
                    </Text>
                  </div>
                  <div className={`${styler('selectContainer')}`}>
                    {audioOutput.length > 0 && (
                      <select
                        name="selectedAudioOutput"
                        className={`${styler('select')}`}
                        onChange={handleInputChange}
                        value={values.selectedAudioOutput}
                      >
                        {audioOutput.map((device, index) => (
                          <option
                            value={device.deviceId}
                            className={`${styler('select')}`}
                            key={index}
                          >
                            {device.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className={styler('errorContainer')}>
                Error in accessing devices. Please check permissions. Are all
                devices plugged in?
              </div>
            )}
            {/** Hide participants view for mobile */}
            {!isMobileDevice() && (
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
                        value={values.maxTileCount}
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
