import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Notifications } from './Notifications';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { Button } from '../TwButton';
import { Text } from '../Text';
import { CloseIcon, ShareScreenIcon } from '../Icons';

const meta: Meta = {
  title: 'Notifications',
  component: Notifications,
};

export default meta;

const Left = () => {
  return <ShareScreenIcon />;
};

const Center = () => {
  return (
    <>
      <p>
        <Text variant="body">
          Sanjana Ma’am is requesting you to share your screen
        </Text>
      </p>
      <Button>Share Screen</Button>
    </>
  );
};

const Right = () => {
  return <CloseIcon className="text-gray-400" />;
};

const Template: Story = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div>
        <Notifications
          leftComponent={<Left />}
          centerComponent={<Center />}
          rightComponent={<Right />}
          {...args}
        />
      </div>
    </HMSThemeProvider>
  );
};

const Light: Story = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div>
        <Notifications
          leftComponent={<Left />}
          centerComponent={<Center />}
          rightComponent={<Right />}
          {...args}
        />
      </div>
    </HMSThemeProvider>
  );
};

const CustomProps: Story = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div>
        <Notifications
          leftComponent={<Left />}
          centerComponent={<Center />}
          rightComponent={<Right />}
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
