import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ControlBarProps, ControlBar } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'ControlBar',
  component: ControlBar,
};

export default meta;

const Template: Story<ControlBarProps> = args => {
  return (
    <div>
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'dark',
        }}
      >
        <ControlBar {...args} />
      </HMSThemeProvider>
    </div>
  );
};

const LightThemeTemplate: Story<ControlBarProps> = args => {
  return (
    <div>
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'light',
        }}
      >
        <ControlBar {...args} />
      </HMSThemeProvider>
    </div>
  );
};
export const Default = Template.bind({});
Default.args = {
  audioButtonOnClick: (e: React.MouseEvent) => {
    alert('audio toggled');
  },
  videoButtonOnClick: (e: React.MouseEvent) => {
    alert('video toggled');
  },
  leaveButtonOnClick: (e: React.MouseEvent) => {
    alert('left room');
  },
  screenshareButtonOnClick: () => {
    alert('Share Screen room');
  },
  chatButtonOnClick: () => {
    alert('chat button clicked');
  },
  isAudioMuted: false,
  isVideoMuted: true,
  isChatOpen: true,
};

export const LightTheme = LightThemeTemplate.bind({});

LightTheme.args = {
  audioButtonOnClick: (e: React.MouseEvent) => {
    alert('audio toggled');
  },
  videoButtonOnClick: (e: React.MouseEvent) => {
    alert('video toggled');
  },
  leaveButtonOnClick: (e: React.MouseEvent) => {
    alert('left room');
  },
  screenshareButtonOnClick: () => {
    alert('Share Screen room');
  },
  chatButtonOnClick: () => {
    alert('chat button clicked');
  },
  isAudioMuted: false,
  isVideoMuted: true,
  isChatOpen: true,
};
