import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import {
  ParticipantsInView,
  ParticipantsInViewProps,
} from './ParticipantsInView';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { Button } from '../Button';

const meta: Meta = {
  title: 'ParticipantsInView',
  component: ParticipantsInView,
};

export default meta;

const Template: Story<ParticipantsInViewProps> = (
  args: ParticipantsInViewProps,
) => {
  const [maxTileCount, setMaxTileCount] = useState(9);
  const [showModal, setShowModal] = useState(false);

  return (
    <HMSThemeProvider
      config={{}}
      appBuilder={{
        theme: 'dark',
      }}
    >
      <div className="w-full h-screen flex justify-center">
        <Button
          variant="standard"
          onClick={() => {
            setShowModal(true);
          }}
          size="md"
          style={{ height: 40 }}
        >
          Show Modal
        </Button>
        <ParticipantsInView
          onTileCountChange={count => {
            setMaxTileCount(count);
          }}
          maxTileCount={maxTileCount}
          showModal={showModal}
          onModalClose={() => setShowModal(false)}
        />
      </div>
    </HMSThemeProvider>
  );
};

export const Default = Template.bind({});

const LightThemeTemplate: Story<ParticipantsInViewProps> = (
  args: ParticipantsInViewProps,
) => {
  const [maxTileCount, setMaxTileCount] = useState(args.maxTileCount);
  const [showModal, setShowModal] = useState(args.showModal);

  return (
    <HMSThemeProvider
      config={{}}
      appBuilder={{
        theme: 'light',
      }}
    >
      <div className="w-full h-screen flex justify-center bg-white pt-5">
        <Button
          variant="standard"
          onClick={() => {
            setShowModal(true);
          }}
          size="md"
          style={{ height: 40 }}
        >
          Show Modal
        </Button>
        <ParticipantsInView
          onTileCountChange={count => {
            setMaxTileCount(count);
          }}
          maxTileCount={maxTileCount}
          showModal={showModal}
          onModalClose={() => setShowModal(false)}
        />
      </div>
    </HMSThemeProvider>
  );
};

export const LightTheme = LightThemeTemplate.bind({});
