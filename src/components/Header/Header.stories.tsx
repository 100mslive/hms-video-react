import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Header, HeaderProps } from './index';
import { ParticipantList } from '../ParticipantList/ParticipantList';

const meta: Meta = {
  title: 'Header',
  component: Header,
};

export default meta;

const Template: Story<HeaderProps> = args => {
  return (
    <div className="bg-black">
      <Header {...args} rightComponents={[]} />
    </div>
  );
};

export const Default = Template.bind({});

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
  peer: { id: '123', displayName: 'Siddhant' },
  time: 1865,
  speaker: 'Siddhant',
  rightComponents: [<ParticipantList participantList={participants} />],
};
