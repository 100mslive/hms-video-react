import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Preview, PreviewProps } from './Preview';
import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';

const meta: Meta = {
  title: 'Preview',
  component: Preview,
};

export default meta;

const Template: Story<PreviewProps> = args => {
  return (
    <div className="bg-black flex h-screen w-screen justify-center pt-12">
      <Preview {...args} />
    </div>
  );
};

const peers: HMSPeer[] = [
  {
    peerId: '1',
    name: 'Aditya 1',
    isLocal: false,
    customerDescription: 'Dummy Description',
    auxiliaryTracks: [],
  },
  {
    peerId: '2',
    name: 'Aditya 2',
    isLocal: false,
    customerDescription: 'Dummy Description',
    auxiliaryTracks: [],
  },
  {
    peerId: '3',
    name: 'Aditya 3',
    isLocal: false,
    customerDescription: 'Dummy Description',
    auxiliaryTracks: [],
  },
  {
    peerId: '4',
    name: 'Aditya 4',
    isLocal: false,
    customerDescription: 'Dummy Description',
    auxiliaryTracks: [],
  },
  {
    peerId: '5',
    name: 'Aditya 5',
    isLocal: false,
    customerDescription: 'Dummy Description',
    auxiliaryTracks: [],
  },
  {
    peerId: '6',
    name: 'Aditya Gupta',
    isLocal: true,
    customerDescription: 'Dummy Description',
    auxiliaryTracks: [],
  },
];

export const Default = Template.bind({});
Default.args = {
  peers: peers,
  roomName: '9th grade Physics',
  joinOnClick: () => alert('Join Clicked'),
  goBackOnClick: () => alert('Go Back Clicked'),
};
