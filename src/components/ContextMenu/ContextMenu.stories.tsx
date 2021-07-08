import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ContextMenuProps, ContextMenu } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { MicOffIcon, StarIcon } from '../Icons';
import { ContextMenuItem } from './ContextMenu';

const meta: Meta = {
  title: 'ContextMenu',
  component: ContextMenu,
  parameters: { actions: { argTypesRegex: '.*OnClick' } },
};

export default meta;

const Template: Story<ContextMenuProps> = args => {
  return (
    <div>
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'dark',
        }}
      >
        <ContextMenu>
          <ContextMenuItem
            label="Mute"
            icon={<MicOffIcon />}
            onClick={() => {}}
          />
        </ContextMenu>
      </HMSThemeProvider>
    </div>
  );
};

const LightTemplate: Story<ContextMenuProps> = args => {
  return (
    <div>
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'light',
        }}
      >
        <ContextMenu>
          <ContextMenuItem
            label="Mute"
            icon={<MicOffIcon />}
            onClick={() => {}}
          />
        </ContextMenu>
      </HMSThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});
export const Light = LightTemplate.bind({});
