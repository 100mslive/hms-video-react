import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Header, HeaderProps } from './index';
import { ParticipantList } from '../ParticipantList';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { fakeParticipants } from '../../storybook/fixtures/peersFixtures';

const meta: Meta = {
  title: 'Header',
  component: Header,
};

export default meta;

const Template: Story<HeaderProps> = args => {
  return (
    <div className="w-full h-screen">
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'dark',
          // logo:
          //   'https://image.shutterstock.com/image-illustration/gold-stack-overflow-icon-on-260nw-1113780074.jpg',
        }}
      >
        <Header {...args} rightComponents={[]} />
      </HMSThemeProvider>
    </div>
  );
};

const LightTemplate: Story<HeaderProps> = args => {
  return (
    <div className="w-full h-screen">
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'light',
          // logo:
          //   'https://image.shutterstock.com/image-illustration/gold-stack-overflow-icon-on-260nw-1113780074.jpg',
        }}
      >
        <Header {...args} rightComponents={[]} />
      </HMSThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});
export const Light = LightTemplate.bind({});

const participants = [
  {
    peer: { id: '123', displayName: 'Alex Tinmayson', role: 'Teacher' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Ankita Bhattacharya', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Anshul Kumar', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Ishaan Awasthi', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Ivy Loppinbug', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Sudhanshu Kumar', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
];

Default.args = {
  time: 1865,
  speaker: 'Siddhant',
  rightComponents: [<ParticipantList participantList={fakeParticipants} />],
};

Light.args = {
  time: 1865,
  speaker: 'Siddhant',
  rightComponents: [<ParticipantList participantList={fakeParticipants} />],
};
