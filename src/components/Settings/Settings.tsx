import React from 'react';
import { Close, SettingsIcon } from '../../icons';
import { CloseButton } from '../MediaIcons';
import { Video, VideoProps } from '../Video';
import { VideoTile, VideoTileProps } from '../VideoTile';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

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

export interface SettingsProps {
  setMaxTileCount: (count: number) => void;
  maxTileCount: number;
}

//TODO replace with unpkg
export const Settings = ({ maxTileCount, setMaxTileCount }: SettingsProps) => {
  const [open, setOpen] = React.useState(false);

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

  return (
    <>
      <button onClick={handleClickOpen}>{SettingsIcon}</button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className=" rounded-lg "
        maxWidth="sm"
      >
        <div className="bg-gray-100 text-white w-full p-2 overflow-y-auto no-scrollbar  divide-solid">
          <div className="text-2xl mb-3 p-2 border-b-2 flex justify-between">
            <span className="flex items-center">
              <span className="pr-4">{SettingsIcon}</span>
              <span className="text-2xl leading-7">Settings</span>
            </span>
            <span>
              <CloseButton clickHandler={handleClose} />
            </span>
          </div>

          <div className="flex flex-wrap text-base">
            <div className="w-full flex my-1.5">
              <div className="w-1/3 flex justify-end items-center ">
                <span>Camera:</span>
              </div>
              <div className="rounded-lg w-1/2 bg-gray-200 p-2 mx-2">
                <select
                  name="role"
                  className="rounded-lg w-full h-full bg-gray-200 focus:outline-none"
                  // value={role}
                  // onChange={event => {
                  //   setRole(event.target.value);
                  // }}
                >
                  <option value="Teacher" className="p-4">
                    Default
                  </option>
                </select>
              </div>
            </div>
            <div className="w-full flex my-1.5">
              <div className="w-1/3 flex justify-end items-center ">
                <span>Microphone:</span>
              </div>
              <div className="rounded-lg w-1/2 bg-gray-200 p-2 mx-2">
                <select
                  name="role"
                  className="rounded-lg w-full h-full bg-gray-200 focus:outline-none"
                  // value={role}
                  // onChange={event => {
                  //   setRole(event.target.value);
                  // }}
                >
                  <option value="Teacher" className="p-4">
                    Default
                  </option>
                </select>
              </div>
            </div>
            <div className="w-full flex my-1.5">
              <div className="w-1/3 flex justify-end items-center ">
                <span>Audio Output:</span>
              </div>
              <div className="rounded-lg w-1/2 bg-gray-200 p-2 mx-2">
                <select
                  name="role"
                  className="rounded-lg w-full h-full bg-gray-200 focus:outline-none"
                  // value={role}
                  // onChange={event => {
                  //   setRole(event.target.value);
                  // }}
                >
                  <option value="Teacher" className="p-4">
                    Default
                  </option>
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
