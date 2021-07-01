import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ControlBarProps, ControlBar } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'ControlBar',
  component: ControlBar,
  parameters: { actions: { argTypesRegex: '.*OnClick' } },
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

const LightTemplate: Story<ControlBarProps> = args => {
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

const defaultArgs = {
  isAudioMuted: true,
  isVideoMuted: true,
  isDetection: false,
  isChatOpen: true,
};

export const Default = Template.bind({});
Default.args = defaultArgs;
export const LightControlBar = LightTemplate.bind({});
LightControlBar.args = defaultArgs;
