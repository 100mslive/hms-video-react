import React from 'react';
import { Meta, Story } from '@storybook/react';
import { InputField, InputFieldProps } from './index';

const meta: Meta = {
  title: 'Input Field',
  component: InputField,
};

export default meta;

const placeHolder = `Enter Your Email Id`;

const BasicInputField: Story<InputFieldProps> = args => {
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <InputField placeHolder={placeHolder} {...args} />
      </div>
    </div>
  );
};

const CompactInputField: Story<InputFieldProps> = args => {
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <InputField compact placeHolder={placeHolder} {...args} />
      </div>
    </div>
  );
};

const ValidationInputField: Story<InputFieldProps> = args => {
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <InputField
          validation="Please Enter a Valid Email Address"
          placeHolder={placeHolder}
          {...args}
        />
      </div>
    </div>
  );
};

const SetStateInputField: Story<InputFieldProps> = args => {
  const [input, setInput] = React.useState<string>(``);
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <InputField
          validation={
            input.includes('@') ? '' : 'Please Enter a Valid Email Address'
          }
          placeHolder={placeHolder}
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput((e.target as HTMLInputElement).value)
          }
          {...args}
        />
      </div>
    </div>
  );
};

export const Default = BasicInputField.bind({});
BasicInputField.args = {};

export const CompactInput = CompactInputField.bind({});
CompactInputField.args = {};

export const ValidationInput = ValidationInputField.bind({});
ValidationInputField.args = {};

export const OnChangeInput = SetStateInputField.bind({});
SetStateInputField.args = {};
