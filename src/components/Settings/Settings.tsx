import React, { useEffect, useState, ChangeEventHandler } from 'react';
import { SettingsIcon, CloseIcon } from '../Icons';
import Dialog from '@material-ui/core/Dialog';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import { withClasses } from '../../utils/styles';
import { Button as TwButton } from '../TwButton';
import HMSLogger from '../../utils/ui-logger';
import { groupBy, Dictionary } from 'lodash';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { resolveClasses } from '../../utils/classes';
// @ts-ignore
import { apply } from 'twind';
import { ButtonClasses } from '../TwButton/Button';

export interface SettingsClasses {
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
interface StyledSettingsProps {
  buttonClases?: ButtonClasses;
  initialValues?: SettingsFormProps;
  onChange?: (values: SettingsFormProps) => void;
  defaultClasses?: SettingsClasses;
  classes?: SettingsClasses;
}

const defaultClasses: SettingsClasses = {
  iconContainer: 'focus:outline-none mr-3 hover:bg-gray-200 p-2 rounded-lg',
  dialogRoot: 'rounded-lg',
  dialogContainer:
    'bg-white text-gray-100 dark:bg-gray-100 dark:text-white w-full p-2 overflow-y-auto no-scrollbar  divide-solid',
  dialogInner: 'text-2xl mb-3 p-2 border-b-2 flex justify-between',
  titleContainer: 'flex items-center',
  titleIcon: 'pr-4',
  titleText: 'text-2xl leading-7',
  formContainer: 'flex flex-wrap text-base',
  formInner: 'w-full flex my-1.5',
  selectLabel: 'w-1/3 flex justify-end items-center',
  selectContainer: 'rounded-lg w-1/2 bg-gray-600 dark:bg-gray-200 p-2 mx-2',
  select:
    'rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none',
  selectInner: 'p-4',
  divider: 'bg-gray-200 h-px w-full my-4',
  sliderContainer: 'w-full my-1.5',
  sliderInner: 'w-full flex',
  sliderLabelContainer: 'w-1/3 flex justify-end items-center ',
  sliderLabel: 'text-right',
  slider: 'rounded-lg w-1/2  p-2 mx-2 flex my-1 items-center ',
  errorContainer: 'flex justify-center items-center w-full px-8 py-4',
};

//TODO figure out how to expose this outside
const HMSSlider = withStyles({
  root: {
    color: 'white',
  },
  thumb: {
    backgroundColor: 'white',
    border: '2px solid currentColor',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
    color: 'black',
  },
  active: {},
  valueLabel: {
    color: 'black',
  },
})(Slider);

//TODO replace with unpkg
const StyledSettings = ({
  onChange,
  initialValues,
  classes,
  buttonClases,
}: StyledSettingsProps) => {
  //TODO accept initial entry values
  const { tw } = useHMSTheme();
  const finalClasses: SettingsClasses = resolveClasses(
    classes || {},
    defaultClasses,
  );

  const [open, setOpen] = useState(false);
  const [deviceGroups, setDeviceGroups] = useState<
    Dictionary<MediaDeviceInfo[]>
  >({});
  const [error, setError] = useState('');

  const [values, setValues] = useState<SettingsFormProps>({
    selectedAudioInput: initialValues?.selectedAudioInput
      ? initialValues?.selectedAudioInput
      : 'default',
    selectedVideoInput: initialValues?.selectedVideoInput
      ? initialValues?.selectedVideoInput
      : 'default',
    selectedAudioOutput: initialValues?.selectedAudioOutput
      ? initialValues?.selectedAudioOutput
      : 'default',
    maxTileCount: initialValues?.maxTileCount ? initialValues?.maxTileCount : 9,
  });

  const handleClickOpen = () => {
    setOpen(true);
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
  };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    const newValues = { ...values };
    //TODO make this generic
    if (typeof newValue === 'number') {
      newValues['maxTileCount'] = newValue;
    }
    setValues(newValues);
  };

  useEffect(() => {
    if (open) {
      navigator.mediaDevices.enumerateDevices().then(
        devices => {
          const deviceGroups = groupBy(devices, 'kind');
          HMSLogger.d('Groups:', deviceGroups);
          setDeviceGroups(deviceGroups);
        },
        error => {
          //TODO this is not working right now
          setError(error);
        },
      );
    }
  }, [open]);

  const videoInput = deviceGroups['videoinput']
    ? deviceGroups['videoinput']
    : [];
  const audioInput = deviceGroups['audioinput']
    ? deviceGroups['audioinput']
    : [];
  const audioOutput = deviceGroups['audiooutput']
    ? deviceGroups['audiooutput']
    : [];
  //TODO handle case where selected device is not in list
  // audioOutput.length > 0 && audioOutput.findIndex(device => device.deviceId===values?.selectedAudioOutput)===-1 && setValues({selectedAudioOutput:videoInput[0].deviceId});
  // audioInput.length > 0 && audioInput.findIndex(device => device.deviceId===values?.selectedAudioInput)===-1 && setValues({selectedAudioInput:videoInput[0].deviceId});
  // videoInput.length > 0 && videoInput.findIndex(device => device.deviceId===values?.selectedVideoInput)===-1 && setValues({selectedVideoInput:videoInput[0].deviceId});

  const parseClass = (s: keyof SettingsClasses) => {
    return tw(`hmsui-settings-${s}`, apply(finalClasses[s]));
  };

  return (
    <>
      <TwButton
        iconOnly
        variant={'no-fill'}
        iconSize="md"
        onClick={handleClickOpen}
        classes={buttonClases}
      >
        <SettingsIcon />
      </TwButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={`${parseClass('dialogRoot')}`}
        maxWidth="sm"
      >
        <div className={`${parseClass('dialogContainer')}`}>
          <div className={`${parseClass('dialogInner')}`}>
            <span className={`${parseClass('titleContainer')}`}>
              <span className={`${parseClass('titleIcon')}`}>
                <SettingsIcon className="w-7 h-7" />
              </span>
              <span className={`${parseClass('titleText')}`}>Settings</span>
            </span>

            <TwButton
              iconOnly
              variant={'no-fill'}
              iconSize="md"
              onClick={handleClose}
            >
              <CloseIcon />
            </TwButton>
          </div>

          <div className={`${parseClass('formContainer')}`}>
            {error === '' ? (
              <>
                <div className={`${parseClass('formInner')}`}>
                  <div className={`${parseClass('selectLabel')}`}>
                    <span>Camera:</span>
                  </div>
                  <div className={`${parseClass('selectContainer')}`}>
                    {videoInput.length > 0 && (
                      <select
                        name="selectedVideoInput"
                        className={`${parseClass('select')}`}
                        onChange={handleInputChange}
                        value={values.selectedVideoInput}
                      >
                        {videoInput.map((device, index) => (
                          <option
                            value={device.deviceId}
                            className={`${parseClass('selectInner')}`}
                            key={index}
                          >
                            {device.label} {device.deviceId}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className={`${parseClass('formInner')}`}>
                  <div className={`${parseClass('selectLabel')}`}>
                    <span>Microphone:</span>
                  </div>
                  <div className={`${parseClass('selectContainer')}`}>
                    {audioInput.length > 0 && (
                      <select
                        name="selectedAudioInput"
                        className={`${parseClass('select')}`}
                        onChange={handleInputChange}
                        value={values.selectedAudioInput}
                      >
                        {audioInput.map((device, index) => (
                          <option
                            value={device.deviceId}
                            className={`${parseClass('selectInner')}`}
                            key={index}
                          >
                            {device.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className={`${parseClass('formInner')}`}>
                  <div className={`${parseClass('selectLabel')}`}>
                    <span>Audio Output:</span>
                  </div>
                  <div className={`${parseClass('selectContainer')}`}>
                    {audioOutput.length > 0 && (
                      <select
                        name="selectedAudioOutput"
                        className={`${parseClass('select')}`}
                        onChange={handleInputChange}
                        value={values.selectedAudioOutput}
                      >
                        {audioOutput.map((device, index) => (
                          <option
                            value={device.deviceId}
                            className={`${parseClass('select')}`}
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
              <div className={parseClass('errorContainer')}>
                Error in accessing devices. Please check permissions. Are all
                devices plugged in?
              </div>
            )}
            {/* <div className="w-full my-1.5">
              <div className="w-full flex  ">
                <div className="w-1/3 flex justify-end items-center ">
                  <span>On Entering Room:</span>
                </div>
                <div className="rounded-lg w-1/2  p-2 mx-2 flex flex-wrap items-center ">
                  <input
                    type="checkbox"
                    id="vehicle1"
                    name="vehicle1"
                    value="Bike"
                    className="checked:bg-white checked:text-white "
                  />
                  <span className="mx-2 ">Keep my microphone off</span>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-1/3 flex justify-end items-center "></div>
                <div className="rounded-lg w-1/2  px-2 mx-2 flex flex-wrap items-center ">
                  <input
                    type="checkbox"
                    id="vehicle1"
                    name="vehicle1"
                    value="Bike"
                    className="checked:bg-white checked:text-white "
                  />
                  <span className="mx-2">Keep my video off</span>
                </div>
              </div>
            </div> */}
            {/* <div className="bg-gray-200 h-px w-full my-4"></div>
            <div className="w-full my-1.5"> */}
            {/* <div className="w-full flex  ">
                <div className="w-1/3 flex justify-end items-center ">
                  <span>Virtual Background:</span>
                </div>
                <div className="rounded-lg w-1/2  p-2 mx-2 flex flex-wrap items-center ">
                  <input
                    type="radio"
                    id="vehicle1"
                    name="vehicle1"
                    value="Bike"
                    className="checked:bg-white checked:text-white "
                  />
                  <span className="mx-2 ">On</span>
                </div>
              </div> */}
            {/* <div className="w-full flex">
                <div className="w-1/3 flex justify-end items-center "></div>
                <div className="rounded-lg w-1/2  px-2 mx-2 flex flex-wrap items-center ">
                  <input
                    type="radio"
                    id="vehicle1"
                    name="vehicle1"
                    value="Bike"
                    className="checked:bg-white checked:text-white "
                  />
                  <span className="mx-2">Off</span>
                </div>
              </div> */}
            {/* <div className="w-full flex">
            <div className="w-1/3 flex justify-end items-center "></div>
            <div className="rounded-lg w-52  h-52 px-2 mx-2 flex flex-wrap items-center ">
              <VideoTile {...props} />
            </div>
          </div> */}
            {/* </div> */}
            {/* <div className="bg-gray-200 h-px w-full my-4"></div>
            <div className="w-full my-1.5">
              <div className="w-full flex  ">
                <div className="w-1/3 flex justify-end items-center ">
                  <span>Mute all Button should:</span>
                </div>
                <div className="rounded-lg w-1/2  p-2 mx-2 flex flex-wrap items-center ">
                  <input
                    type="radio"
                    id="vehicle1"
                    name="vehicle1"
                    value="Bike"
                    className="checked:bg-white checked:text-white "
                  />
                  <span className="mx-2 ">Mute Everyone expect me.</span>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-1/3 flex justify-end items-center "></div>
                <div className="rounded-lg w-1/2  px-2 mx-2 flex flex-wrap items-center ">
                  <input
                    type="radio"
                    id="vehicle1"
                    name="vehicle1"
                    value="Bike"
                    className="checked:bg-white checked:text-white "
                  />
                  <span className="mx-2">Mute Everyone in the room.</span>
                </div>
              </div>
            </div> */}
            <div className={parseClass('divider')}></div>
            <div className={parseClass('sliderContainer')}>
              <div className={parseClass('sliderInner')}>
                <div className={parseClass('sliderLabelContainer')}>
                  <span className={parseClass('sliderLabel')}>
                    Participants in view:
                  </span>
                </div>
                <div className={parseClass('slider')}>
                  <HMSSlider
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
              {/* <div className="w-full flex">
                <div className="w-1/3 flex justify-end items-center "></div>
                <div className="rounded-lg w-1/2  px-2 mx-2 flex my-1 items-center ">
                  <input
                    type="radio"
                    id="vehicle1"
                    name="vehicle1"
                    value="Bike"
                    className="checked:bg-white checked:text-white "
                  />
                  <span className="mx-2">Always stay in small view.</span>
                </div>
              </div> */}
              {/* <div className="w-full flex ">
                <div className="w-1/3 flex justify-end items-center "></div>
                <div className="rounded-lg w-1/2  px-2 mx-2 flex my-1 items-center ">
                  <Slider
                    defaultValue={8}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={30}
                  />
                </div>
              </div> */}
              {/* <div className="w-full flex m-1">
                <div className="w-1/3 flex justify-end items-center "></div>
                <div className="rounded-lg w-1/4 bg-gray-200 p-1 mx-5">
                  <select
                    name="role"
                    className="rounded-lg w-full h-full bg-gray-200 focus:outline-none"
                    // value={role}
                    // onChange={event => {
                    //   setRole(event.target.value);
                    // }}
                  >
                    <option value="Teacher" className="p-4">
                      1
                    </option>
                    <option value="Teacher" className="p-4">
                      2
                    </option>
                    <option value="Teacher" className="p-4">
                      3
                    </option>
                  </select>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export type SettingsProps = Omit<StyledSettingsProps, 'defaultClasses'>;

//TODO replace with theme context
export const Settings = withClasses<SettingsClasses | undefined>(
  defaultClasses,
  'settings',
)<StyledSettingsProps>(StyledSettings);
