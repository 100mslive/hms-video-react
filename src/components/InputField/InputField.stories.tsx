import React from 'react';
import { Meta, Story } from '@storybook/react';
import { InputField, InputFieldProps } from './index';

const meta: Meta = {
  title: 'Input Field',
  component: InputField,
};

export default meta;

const BasicInputField: Story<InputFieldProps> = args => {
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <InputField {...args} />
      </div>
    </div>
  );
};

export const Default = BasicInputField.bind({});
BasicInputField.args = {};
