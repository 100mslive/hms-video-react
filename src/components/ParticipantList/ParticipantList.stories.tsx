import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ParticipantList, ParticipantListProps } from './ParticipantList';

const meta: Meta = {
  title: 'ParticipantList',
  component: ParticipantList,
};

export default meta;

const Template: Story<ParticipantListProps> = args => (
  <div>
    <ParticipantList {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {
  teacherList: [
    {
      peer: { id: '123', displayName: 'Sanjana Ma`am (You)' },
      isAudioMuted: false,
      isStarMarked: false,
    },
  ],
  studentList: [
    {
      peer: { id: '123', displayName: 'Alex Tinmayson' },
      isAudioMuted: false,
      isStarMarked: false,
    },
    {
      peer: { id: '123', displayName: 'Ankita Bhattacharya ' },
      isAudioMuted: false,
      isStarMarked: false,
    },
    {
      peer: { id: '123', displayName: 'Anshul Kumar' },
      isAudioMuted: false,
      isStarMarked: false,
    },
    {
      peer: { id: '123', displayName: 'Ishaan Awasthi' },
      isAudioMuted: false,
      isStarMarked: false,
    },
    {
      peer: { id: '123', displayName: 'Ivy Loppinbug' },
      isAudioMuted: false,
      isStarMarked: false,
    },
    {
      peer: { id: '123', displayName: 'Sudhanshu Kumar' },
      isAudioMuted: false,
      isStarMarked: false,
    },
  ],
};
