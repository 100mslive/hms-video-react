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
  const [maxTileCount, setMaxTileCount] = useState(8);
  return (
    <div className="w-full flex justify-center">
      <Settings maxTileCount={maxTileCount} setMaxTileCount={setMaxTileCount} />
    </div>
  );
};

export const Default = Template.bind({});
