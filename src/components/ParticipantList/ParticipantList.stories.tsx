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
export const Real = Template.bind({});

Default.args = {
  participantList: [
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
  ],
};

Real.args = {
  participantList: [
    {
      peer: {
        id: 'dasd-232',
        displayName: 'ni',
      },
    },
    {
      peer: {
        id: 'asdasd232-',
        displayName: 'Aniket Behera',
      },
    },
  ],
};
