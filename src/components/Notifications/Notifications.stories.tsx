import React from 'react';
import { Meta, Story } from '@storybook/react';
import {
  hmsToast,
  HMSToastContainer,
  NotificationProps,
  Notifications,
} from './Notifications';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { Button } from '../Button';
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
      <Text variant="body">
        Sanjana Ma’am is requesting you to share your screen
      </Text>
      <Button>Share Screen</Button>
    </>
  );
};

const Right = () => {
  return <CloseIcon className="text-gray-400" />;
};

const handleClick = (args: NotificationProps) => {
  hmsToast('', {
    left: <Left />,
    center: <Center />,
    right: <Right />,
    ...args,
  });
};

const Template: Story = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <Button onClick={() => handleClick(args)}>Trigger Notification</Button>
      <HMSToastContainer />
    </HMSThemeProvider>
  );
};

const Light: Story = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <Button onClick={() => handleClick(args)}>Trigger Notification</Button>
      <HMSToastContainer />
    </HMSThemeProvider>
  );
};

const CustomProps: Story = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <Button onClick={() => handleClick(args)}>Trigger Notification</Button>
      <HMSToastContainer />
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});
export const LightMode = Light.bind({});
export const CustomToastProps = CustomProps.bind({});
