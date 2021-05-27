import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Notifications } from './Notifications';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Notifications',
  component: Notifications,
};

export default meta;

const Template: Story = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div>
        <Notifications {...args} />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});
