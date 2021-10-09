import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { PostLeaveDisplay, FeedbackForm } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'PostLeaveDisplay',
  component: PostLeaveDisplay,
};

export default meta;

const Template: Story = args => {
  // const [showModal, setShowModal] = useState(false);
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

          getFeedbackOnClick={(setShowModal) => {
            alert('feedback clicked');
            setShowModal(true);
          }}
          FeedbackForm={FeedbackForm}
        />
      </HMSThemeProvider>
    </div>
  );
};

const Custom: Story = args => {

  return (
    <div className="w-full h-screen bg-black">
      <HMSThemeProvider
        config={{}}
        appBuilder={{
          theme: 'dark',
        }}
      >
        <PostLeaveDisplay
          src="https://images.unsplash.com/photo-1492112007959-c35ae067c37b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
          {...args}
          joinRoomOnClick={() => {
            alert('join room clicked');
          }}
          goToDashboardOnClick={() => {
            alert('go to dashboard ');
          }}

          getFeedbackOnClick={(setShowModal) => {
            setShowModal(true);
          }}
          FeedbackForm={FeedbackForm}
        />
      </HMSThemeProvider>
    </div>
  );
};

export const Default = Template.bind({});
export const CustomImage = Custom.bind({});
