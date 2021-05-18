import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Input, InputProps } from './index';

const meta: Meta = {
  title: 'Input Field',
  component: Input,
};

export default meta;

const placeHolder = `Enter Your Email Id`;

const BasicInputField: Story<InputProps> = args => {
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <Input placeHolder={placeHolder} {...args} />
      </div>
    </div>
  );
};

const CompactInputField: Story<InputProps> = args => {
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <Input compact placeHolder={placeHolder} {...args} />
      </div>
    </div>
  );
};

const ValidationInputField: Story<InputProps> = args => {
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <Input
          validation="Please Enter a Valid Email Address"
          placeHolder={placeHolder}
          {...args}
        />
      </div>
    </div>
  );
};

const SetStateInputField: Story<InputProps> = args => {
  const [input, setInput] = React.useState<string>(``);
  return (
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <Input
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
