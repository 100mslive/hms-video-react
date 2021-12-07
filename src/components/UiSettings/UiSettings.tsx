import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import { stringify } from 'postcss';
import React, { useMemo, useState, useEffect, Fragment } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { MessageModal } from '../MessageModal';
import { Slider } from '../Slider/Slider';
import { UiSettingsSection } from './UiSettingsSection';

export interface UiSettingsClasses {
  sliderContainer?: string;
  slider?: string;
  divider?: string;
  notificationContainer?: string;
  checkBoxLabel?: string;
}

const defaultClasses = {
  sliderContainer: 'w-full',
  slider: 'rounded-lg w-full p-2 flex items-center ',
  divider: 'bg-gray-600 dark:bg-gray-200 h-px w-full my-4',
  notificationContainer: 'w-full p-2',
  checkBoxLabel: 'text-lg space-x-1.5 flex items-center',
};

export type uiViewModeTypes = 'activeSpeaker' | 'grid';

export interface UiSettingsProps {
  classes?: UiSettingsClasses;
  sliderProps: {
    onTileCountChange: (value: number) => void;
    maxTileCount: number;
  };
  notificationProps: {
    onNotificationChange: (value: {
      type: string;
      isSubscribed: boolean;
    }) => void;
    subscribedNotifications: { [key: string]: boolean };
  };
  layoutProps: {
    onViewModeChange: (value: uiViewModeTypes) => void;
    uiViewMode: uiViewModeTypes;
  };

  showModal?: boolean;
  onModalClose?: () => void;
}
export const UiSettings = ({
  classes,
  sliderProps,
  notificationProps,
  layoutProps,
  showModal,
  onModalClose = () => {},
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
  const handleNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    notificationProps.onNotificationChange({
      type,
      isSubscribed: event.target.checked,
    });
  };

  const handleViewModeChange = (value: uiViewModeTypes) => {
    layoutProps.onViewModeChange(value);
  };
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
          <UiSettingsSection
            title="Participants In View"
            body={
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
            }
          />
          <UiSettingsSection
            title="Recieve notifications for"
            body={
              <div className={styler('notificationContainer')}>
                <label className={styler('checkBoxLabel')}>
                  <input
                    type="checkbox"
                    onChange={e => handleNotificationChange(e, 'PEER_JOINED')}
                    checked={
                      notificationProps.subscribedNotifications.PEER_JOINED
                    }
                  />
                  <span>Peer Join</span>
                </label>
                <label className={styler('checkBoxLabel')}>
                  <input
                    type="checkbox"
                    onChange={e => handleNotificationChange(e, 'PEER_LEFT')}
                    checked={
                      notificationProps.subscribedNotifications.PEER_LEFT
                    }
                  />
                  <span>Peer Leave</span>
                </label>
                <label className={styler('checkBoxLabel')}>
                  <input
                    type="checkbox"
                    onChange={e => handleNotificationChange(e, 'NEW_MESSAGE')}
                    checked={
                      notificationProps.subscribedNotifications.NEW_MESSAGE
                    }
                  />
                  <span>New Message</span>
                </label>
                <label className={styler('checkBoxLabel')}>
                  <input
                    type="checkbox"
                    onChange={e => handleNotificationChange(e, 'ERROR')}
                    checked={notificationProps.subscribedNotifications.ERROR}
                  />
                  <span>Errors</span>
                </label>
                <label className={styler('checkBoxLabel')}>
                  <input
                    type="checkbox"
                    onChange={e =>
                      handleNotificationChange(e, 'METADATA_UPDATED')
                    }
                    checked={
                      notificationProps.subscribedNotifications.METADATA_UPDATED
                    }
                  />
                  <span>Hand Raise</span>
                </label>
              </div>
            }
          />
          <UiSettingsSection
            title="View Layout"
            body={
              <div className={styler('notificationContainer')}>
                <label className={styler('checkBoxLabel')}>
                  <input
                    type="checkbox"
                    onChange={e =>
                      handleViewModeChange(
                        e.target.checked ? 'activeSpeaker' : 'grid',
                      )
                    }
                    checked={layoutProps.uiViewMode === 'activeSpeaker'}
                  />
                  <span>Active Speaker View</span>
                </label>
              </div>
            }
          />
        </Fragment>
      }
    />
  );
};
