import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { UiSettings, UiSettingsProps, uiViewModeTypes } from './UiSettings';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { Button } from '../Button';

const meta: Meta = {
  title: 'UiSettings',
  component: UiSettings,
};

export default meta;

const Template: Story<UiSettingsProps> = (args: UiSettingsProps) => {
  const [maxTileCount, setMaxTileCount] = useState(9);
  const [showModal, setShowModal] = useState(false);
  const [subscribedNotifications, setSubscribedNotifications] = useState({
    PEER_JOINED: false,
    PEER_LEFT: false,
    NEW_MESSAGE: true,
    ERROR: true,
  });
  const [uiViewMode, setuiViewMode] = useState<uiViewModeTypes>('grid');

  const onChange = (count: number) => {
    setMaxTileCount(count);
  };

  const onNotificationChange = (notification: {
    type: string;
    isSubscribed: boolean;
  }) => {
    setSubscribedNotifications((prevState: any) => ({
      ...prevState,
      [notification.type]: notification.isSubscribed,
    }));
  };

  const onViewModeChange = (layout: uiViewModeTypes) => {
    setuiViewMode(layout);
  };

  const uiSettingsProps = {
    sliderProps: {
      onTileCountChange: onChange,
      maxTileCount,
    },
    notificationProps: {
      onNotificationChange,
      subscribedNotifications,
    },
    layoutProps: {
      onViewModeChange,
      uiViewMode,
    },
  };
  return (
    <HMSThemeProvider
      config={{}}
      appBuilder={{
        theme: 'dark',
      }}
    >
      <div className="w-full h-screen flex justify-center">
        <Button
          variant="standard"
          onClick={() => {
            setShowModal(true);
          }}
          size="md"
          style={{ height: 40 }}
        >
          Show Modal
        </Button>
        <UiSettings
          {...uiSettingsProps}
          showModal={showModal}
          onModalClose={() => setShowModal(false)}
        />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});

const LightThemeTemplate: Story<UiSettingsProps> = (args: UiSettingsProps) => {
  const [maxTileCount, setMaxTileCount] = useState(9);
  const [showModal, setShowModal] = useState(false);
  const [subscribedNotifications, setSubscribedNotifications] = useState({
    PEER_JOINED: false,
    PEER_LEFT: false,
    NEW_MESSAGE: true,
    ERROR: true,
  });
  const [uiViewMode, setuiViewMode] = useState<uiViewModeTypes>('grid');

  const onChange = (count: number) => {
    setMaxTileCount(count);
  };

  const onNotificationChange = (notification: {
    type: string;
    isSubscribed: boolean;
  }) => {
    setSubscribedNotifications((prevState: any) => ({
      ...prevState,
      [notification.type]: notification.isSubscribed,
    }));
  };

  const onViewModeChange = (layout: 'activeSpeaker' | 'grid') => {
    setuiViewMode(layout);
  };

  const uiSettingsProps = {
    sliderProps: {
      onTileCountChange: onChange,
      maxTileCount,
    },
    notificationProps: {
      onNotificationChange,
      subscribedNotifications,
    },
    layoutProps: {
      onViewModeChange,
      uiViewMode,
    },
  };
  return (
    <HMSThemeProvider
      config={{}}
      appBuilder={{
        theme: 'light',
      }}
    >
      <div className="w-full h-screen flex justify-center bg-white pt-5">
        <Button
          variant="standard"
          onClick={() => {
            setShowModal(true);
          }}
          size="md"
          style={{ height: 40 }}
        >
          Show Modal
        </Button>
        <UiSettings
          {...uiSettingsProps}
          showModal={showModal}
          onModalClose={() => setShowModal(false)}
        />
      </div>
    </HMSThemeProvider>
  );
};

export const LightTheme = LightThemeTemplate.bind({});
