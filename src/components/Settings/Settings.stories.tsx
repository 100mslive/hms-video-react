import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Settings, SettingsProps } from './Settings';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Settings',
  component: Settings,

  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<SettingsProps> = (args: SettingsProps) => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div className="w-full flex justify-center">
        <Settings />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});

const LightThemeTemplate: Story<SettingsProps> = (args: SettingsProps) => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div className="w-full h-screen flex justify-center bg-white pt-5">
        <Settings />
      </div>
    </HMSThemeProvider>
  );
};

export const LightTheme = LightThemeTemplate.bind({});
