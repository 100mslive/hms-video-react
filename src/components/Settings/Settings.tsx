import React, { useEffect } from 'react';
import { SettingsIcon } from '../../icons';
import { CloseButton } from '../MediaIcons';
import Dialog from '@material-ui/core/Dialog';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';
//@ts-ignore
import { create } from 'twind';

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
}

interface StyledSettingsProps {
  setMaxTileCount: (count: number) => void;
  maxTileCount: number;
  defaultClasses?: SettingsClasses;
  classes?: SettingsClasses;
}

const defaultClasses: SettingsClasses = {
  iconContainer: 'focus:outline-none mr-3 hover:bg-gray-200 p-2 rounded-lg',
  dialogRoot: 'rounded-lg',
  dialogContainer:
    'dark:bg-gray-100 dark:text-white w-full p-2 overflow-y-auto no-scrollbar  divide-solid',
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
  maxTileCount,
  setMaxTileCount,
  defaultClasses,
  classes: extraClasses,
}: StyledSettingsProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [open, setOpen] = React.useState(false);
  const [audioInput, setAudioInput] = React.useState<MediaDeviceInfo[]>([]);
  const [audioOutput, setAudioOutput] = React.useState<MediaDeviceInfo[]>([]);
  const [videoInput, setVideoInput] = React.useState<MediaDeviceInfo[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: any, newValue: number | number[]) => {
    console.log(newValue);
    setMaxTileCount(newValue as number);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      for (let device of devices) {
        if (device.kind === 'videoinput') {
          setVideoInput(videoDevices => [...videoDevices, device]);
        } else if (device.kind === 'audioinput') {
          setAudioInput(prevAudioInput => [...prevAudioInput, device]);
        } else if (device.kind === 'audiooutput') {
          setAudioOutput(prevAudioOutput => [...prevAudioOutput, device]);
        }
      }
    });
  }, []);

  return (
    <>
      <button
        onClick={handleClickOpen}
        className={`${combinedClasses?.iconContainer}`}
      >
        <SettingsIcon />
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={`${combinedClasses?.dialogRoot}`}
        maxWidth="sm"
      >
        <div className={`${combinedClasses?.dialogContainer}`}>
          <div className={`${combinedClasses?.dialogInner}`}>
            <span className={`${combinedClasses?.titleContainer}`}>
              <span className={`${combinedClasses?.titleIcon}`}>
                <SettingsIcon className="w-2 h-2" />
              </span>
              <span className={`${combinedClasses?.titleText}`}>Settings</span>
            </span>
            <span>
              <CloseButton clickHandler={handleClose} />
            </span>
          </div>

          <div className={`${combinedClasses?.formContainer}`}>
            <div className={`${combinedClasses?.formInner}`}>
              <div className={`${combinedClasses?.selectLabel}`}>
                <span>Camera:</span>
              </div>
              <div className={`${combinedClasses?.selectContainer}`}>
                <select
                  name="camera"
                  className={`${combinedClasses?.select}`}
                  // value={role}
                  // onChange={event => {
                  //   setRole(event.target.value);
                  // }}
                >
                  {videoInput.map((device, index) => (
                    <option
                      value="Teacher"
                      className={`${combinedClasses?.selectInner}`}
                      key={index}
                    >
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={`${combinedClasses?.formInner}`}>
              <div className={`${combinedClasses?.selectLabel}`}>
                <span>Microphone:</span>
              </div>
              <div className={`${combinedClasses?.selectContainer}`}>
                <select
                  name="microphone"
                  className={`${combinedClasses?.select}`}
                  // value={role}
                  // onChange={event => {
                  //   setRole(event.target.value);
                  // }}
                >
                  {audioInput.map((device, index) => (
                    <option
                      value="Teacher"
                      className={`${combinedClasses?.selectInner}`}
                      key={index}
                    >
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={`${combinedClasses?.formInner}`}>
              <div className={`${combinedClasses?.selectLabel}`}>
                <span>Audio Output:</span>
              </div>
              <div className={`${combinedClasses?.selectContainer}`}>
                <select
                  name="audio-output"
                  className={`${combinedClasses?.select}`}
                  // value={role}
                  // onChange={event => {
                  //   setRole(event.target.value);
                  // }}
                >
                  {audioOutput.map((device, index) => (
                    <option
                      value="Teacher"
                      className={`${combinedClasses?.select}`}
                      key={index}
                    >
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
            <div className="bg-gray-200 h-px w-full my-4"></div>
            <div className="w-full my-1.5">
              <div className="w-full flex  ">
                <div className="w-1/3 flex justify-end items-center ">
                  <span className="text-right">Participants in view:</span>
                </div>
                <div className="rounded-lg w-1/2  p-2 mx-2 flex my-1 items-center ">
                  <HMSSlider
                    defaultValue={8}
                    value={maxTileCount}
                    onChange={handleChange}
                    aria-labelledby="continuous-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    min={1}
                    max={30}
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
