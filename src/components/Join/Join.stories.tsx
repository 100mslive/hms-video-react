import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Join, JoinProps } from './Join';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Join',
  component: Join,
};

export default meta;

const Template: Story<JoinProps> = args => {
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

export const Default = Template.bind({});
Default.args = {
  submitOnClick: params =>
    alert(`Join Clicked, ${JSON.stringify(params, null, 2)}`),
};

export const OverrideClasses = OverrideClass.bind({});
Default.args = {
  submitOnClick: params =>
    alert(`Join Clicked, ${JSON.stringify(params, null, 2)}`),
};
