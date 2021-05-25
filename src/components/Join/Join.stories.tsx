import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Join, JoinProps } from './Join';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';
import { storyBookSDK } from '../../storybook/store/SetUpFakeStore';

const meta: Meta = {
  title: 'Join',
  component: Join,
  parameters: { actions: { argTypesRegex: '.*OnClick' } },
};

export default meta;

const Template: Story<JoinProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div>
        <Join {...args} />
      </div>
    </HMSThemeProvider>
  );
};

const LightTemplate: Story<JoinProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div>
        <Join {...args} />
      </div>
    </HMSThemeProvider>
  );
};

const OverrideClass: Story<JoinProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div>
        <Join {...args} classes={{ containerRoot: 'dark:bg-red-main' }} />
      </div>
    </HMSThemeProvider>
  );
};

const joinArgs = {
  submitOnClick: (...args: any[]) => storyBookSDK.join(...args),
};

export const Default = Template.bind({});
Default.args = joinArgs;

export const OverrideClasses = OverrideClass.bind({});
OverrideClasses.args = joinArgs;
export const Light = LightTemplate.bind({});
Default.args = joinArgs;
