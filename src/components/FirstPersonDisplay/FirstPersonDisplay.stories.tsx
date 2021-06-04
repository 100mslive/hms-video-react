import React from 'react';
import { Meta, Story } from '@storybook/react';
import { FirstPersonDisplay } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'FirstPersonDisplay',
  component: FirstPersonDisplay,
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
        <FirstPersonDisplay {...args} />
      </HMSThemeProvider>
    </div>
  );
};

const Custom: Story = args => {
  return (
    <div className="w-full h-screen bg-black">
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'dark',
        }}
      >
        <FirstPersonDisplay
          src="https://images.unsplash.com/photo-1492112007959-c35ae067c37b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
          {...args}
        />
      </HMSThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});
export const CustomImage = Custom.bind({});
