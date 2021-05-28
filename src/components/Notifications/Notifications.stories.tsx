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

const Light: Story = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div>
        <Notifications {...args} />
      </div>
    </HMSThemeProvider>
  );
};

const CustomProps: Story = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div>
        <Notifications
          toastProps={{ position: 'top-center', hideProgressBar: true }}
          {...args}
        />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});
export const LightMode = Light.bind({});
export const CustomToastProps = CustomProps.bind({});
