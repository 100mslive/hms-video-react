import React from 'react';
import { Meta, Story } from '@storybook/react';
import { PostLeaveDisplay } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'PostLeaveDisplay',
  component: PostLeaveDisplay,
};

export default meta;

const Template: Story = args => {
  return (
    <div className="w-full h-screen">
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'dark',
        }}
      >
        <PostLeaveDisplay
          {...args}
          joinRoomOnClick={() => {
            alert('join room clicked');
          }}
          goToDashboardOnClick={() => {
            alert('go to dashboard ');
          }}
        />
      </HMSThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});
