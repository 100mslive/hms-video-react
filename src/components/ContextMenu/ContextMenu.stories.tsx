import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ContextMenuProps, ContextMenu } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { MicOffIcon, StarIcon } from '../Icons';

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
        <ContextMenu
          items={[
            {
              label: 'Mute',
              value: false,
              icon: <MicOffIcon className="fill-current text-white" />,
            },
            { label: 'Spotlight', value: false, icon: <StarIcon /> },
          ]}
          onItemClick={item => alert(`${item.label} clicked`)}
        />
      </HMSThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});
