import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Silence} from './index';

const meta: Meta = {
  title: 'Silence',
  component: Silence,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = args => <Silence {...args} />;

export const DefaultSilence = Template.bind({});

DefaultSilence.args = {};
