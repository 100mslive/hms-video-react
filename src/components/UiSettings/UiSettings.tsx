import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import React, { useMemo, useState, useEffect, Fragment } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { MessageModal } from '../MessageModal';
import { Slider } from '../Slider/Slider';
import { SingleSection } from './SingleSection';

export interface UiSettingsClasses {
  sliderContainer?: string;
  slider?: string;
  divider?: string;
  notificationContainer?: string
}

const defaultClasses = {
  sliderContainer: 'w-full',
  slider: 'rounded-lg w-full p-2 flex items-center ',
  divider: 'bg-gray-600 dark:bg-gray-200 h-px w-full my-4',
  notificationContainer: 'w-full mt-2 p-2'
};

export interface UiSettingsProps {
  classes?: UiSettingsClasses;
  sliderProps: {
    onTileCountChange: (value: number) => void;
    maxTileCount: number;
  };
  notificationProps: {
    onNotificationChange: (value: { "type": string, "isSubscribed": boolean }) => void;
    subscribedNotifications: { [key: string]: boolean; };
  };

  showModal?: boolean;
  onModalClose?: () => void;
}
export const UiSettings = ({
  classes,
  sliderProps,
  notificationProps,
  showModal,
  onModalClose = () => { },
}: UiSettingsProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<UiSettingsClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-ui-settings',
      }),
    [],
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (showModal === undefined) {
      return;
    }
    setOpen(showModal);
  }, [showModal]);

  const handleClose = () => {
    setOpen(false);
    onModalClose();
  };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    //TODO make this generic
    if (typeof newValue === 'number') {
      sliderProps.onTileCountChange(newValue);
    }
  };
  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    notificationProps.onNotificationChange({ type, isSubscribed: event.target.checked });
  }
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  return (
    <MessageModal
      show={open}
      onClose={handleClose}
      classes={{ header: 'mb-2' }}
      title="UI Settings"
      body={
        <Fragment>
          <div className={styler('divider')}></div>
          <SingleSection title="Participants In View" body={
            <div className={styler('sliderContainer')}>
              <div className={styler('slider')}>
                <Slider
                  name="maxTileCount"
                  value={sliderProps.maxTileCount}
                  //@ts-ignore
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
          } />
          <SingleSection title="Recieve notifications for" body={
            <div className={styler('notificationContainer')} >
              <FormGroup>
                <FormControlLabel control={<Checkbox  {...label} onChange={(e) => handleNotificationChange(e, "PEER_JOINED")} color="primary" checked={notificationProps.subscribedNotifications.PEER_JOINED} size="small" />} label="Peer Join" />

                <FormControlLabel control={<Checkbox {...label} onChange={(e) => handleNotificationChange(e, "PEER_LEFT")} color="primary" checked={notificationProps.subscribedNotifications.PEER_LEFT} size="small" />} label="Peer Leave" />

                <FormControlLabel control={<Checkbox {...label} onChange={(e) => handleNotificationChange(e, "NEW_MESSAGE")} color="primary" checked={notificationProps.subscribedNotifications.NEW_MESSAGE} size="small" />} label="New Message" />
                
                <FormControlLabel control={<Checkbox {...label} onChange={(e) => handleNotificationChange(e, "ERROR")} color="primary" checked={notificationProps.subscribedNotifications.ERROR} size="small" />} label="Errors" />
              </FormGroup>
            </div>
          } />
        </Fragment>
      }
    />
  );
};
