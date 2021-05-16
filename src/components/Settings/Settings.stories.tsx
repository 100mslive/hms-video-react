import React, { useState } from 'react';
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
  const [maxTileCount, setMaxTileCount] = useState(8);
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div className="w-full flex justify-center">
        <Settings
          onChange={props => {
            alert(JSON.stringify(props));
          }}
        />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});
