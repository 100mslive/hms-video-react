import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Select, SelectProps } from './index';

const meta: Meta = {
  title: 'Select',
  component: Select,
};

export default meta;

const BasicSelectField: Story<SelectProps> = args => {
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <Select {...args} />
      </div>
    </div>
  );
};

export const Default = BasicSelectField.bind({});
BasicSelectField.args = {};
