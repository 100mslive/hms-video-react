import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ScreenShareDisplay } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'ScreenShareDisplay',
  component: ScreenShareDisplay,
};

export default meta;

const Template: Story = args => {
  return (
    <div className="w-full h-screen bg-black">
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'dark',
        }}
      >
        <ScreenShareDisplay
          {...args}
          stopScreenShare={() => {
            alert('stopping screen share');
          }}
        />
      </HMSThemeProvider>
    </div>
  );
};

const Light: Story = args => {
  return (
    <div className="w-full h-screen bg-white">
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'light',
        }}
      >
        <ScreenShareDisplay
          {...args}
          stopScreenShare={() => {
            alert('stopping screen share');
          }}
        />
      </HMSThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});
export const LightMode = Light.bind({});
