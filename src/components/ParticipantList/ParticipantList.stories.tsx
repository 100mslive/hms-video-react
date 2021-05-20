import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ParticipantList, ParticipantListProps } from './ParticipantList';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { fakeParticipants } from '../../storybook/fixtures/peersFixtures';

const meta: Meta = {
  title: 'ParticipantList',
  component: ParticipantList,
};

export default meta;

const Template: Story<ParticipantListProps> = args => (
  <HMSThemeProvider
    config={{
      theme: {
        extend: {
          fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
            body: ['Montserrat', 'sans-serif'],
          },
        },
      },
    }}
    appBuilder={{ theme: 'dark' }}
  >
    <ParticipantList {...args} />
  </HMSThemeProvider>
);

const DarkTemplate: Story<ParticipantListProps> = args => (
  <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
    <ParticipantList {...args} />
  </HMSThemeProvider>
);

const LightTemplate: Story<ParticipantListProps> = args => (
  <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
    <ParticipantList {...args} />
  </HMSThemeProvider>
);

export const Default = Template.bind({});
export const Real = Template.bind({});
export const Dark = DarkTemplate.bind({});
export const Light = LightTemplate.bind({});

const defaultArgs = {participantList: fakeParticipants};
Default.args = defaultArgs;

Real.args = {
  participantList: [
    {
      peer: {
        id: '123',
        displayName: 'Sudhanshu Kumar asdasdasdasdasdasdasdasdas',
      },
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

Light.args = defaultArgs;
Dark.args = defaultArgs;
