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

export const Default = Template.bind({});
