import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Header, HeaderProps } from './index';
import { ParticipantList } from '../ParticipantList/ParticipantList';
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

Default.args = {
  peer: { id: '123', displayName: 'Siddhant' },
  time: 1865,
  speaker: 'Siddhant',
  rightComponents: [<ParticipantList participantList={fakeParticipants} />],
};

Light.args = {
  peer: { id: '123', displayName: 'Siddhant' },
  time: 1865,
  speaker: 'Siddhant',
  rightComponents: [<ParticipantList participantList={fakeParticipants} />],
};
