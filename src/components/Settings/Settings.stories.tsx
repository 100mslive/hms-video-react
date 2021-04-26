import React, { useEffect, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Settings, SettingsProps } from './Settings';
import { loadStream } from '../../storybook/utils';

const meta: Meta = {
  title: 'Settings',
  component: Settings,

  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<SettingsProps> = (args: SettingsProps) => {
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>();
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>();

  useEffect(() => {
    window.navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function(stream) {
        //console.log('Updating stream with camera feed', stream);
        setVideoTrack(stream.getVideoTracks()[0]);
        setAudioTrack(stream.getAudioTracks()[0]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args.videoSource, args.isLocal]);

  return (
    <Settings
      {...args}
      videoTrack={videoTrack!}
      audioTrack={audioTrack!}
      isLocal={true}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  peer: { id: '123', displayName: 'Nikhil' },
  aspectRatio: {
    width: 1,
    height: 1,
  },
};
