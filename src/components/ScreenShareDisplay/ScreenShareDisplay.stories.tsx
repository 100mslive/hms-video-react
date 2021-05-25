import React from 'react';
import { Meta, Story } from '@storybook/react';
import ScreenShareDisplay from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'ScreenShareDisplay',
  component: ScreenShareDisplay,
};

export default meta;

const Template: Story = (args) => {
  return (
    <div className='w-full h-screen'>
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'dark',
        }}
      >
        <ScreenShareDisplay {...args} />
      </HMSThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});
