import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Input, InputProps } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Input Field',
  component: Input,
};

export default meta;

const placeHolder = `Enter Your Email Id`;

const BasicInputField: Story<InputProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{theme:'dark'}}>
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <Input placeHolder={placeHolder} {...args} />
      </div>
    </div>
    </HMSThemeProvider>
  );
};

const CompactInputField: Story<InputProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{theme:'light'}}>
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <Input compact placeHolder={placeHolder} {...args} />
      </div>
    </div>
    </HMSThemeProvider>
  );
};

const ValidationInputField: Story<InputProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{theme:'light'}}>
    <div className="w-full bg-black py-10">
      <div className="w-1/3 mx-auto">
        <Input
          validation="Please Enter a Valid Email Address"
          placeHolder={placeHolder}
          {...args}
        />
      </div>
    </div>
    </HMSThemeProvider>
  );
};

const Light: Story<InputProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{theme:'light'}}>
    <div className="w-full bg-white py-10">
      <div className="w-1/3 mx-auto">
        <Input placeHolder={placeHolder} {...args} />
      </div>
    </div>
    </HMSThemeProvider>
  );
};



const SetStateInputField: Story<InputProps> = args => {
  const [input, setInput] = React.useState<string>(``);
  return (
    <HMSThemeProvider config={{}} appBuilder={{theme:'dark'}}>
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
    </HMSThemeProvider>
  );
};

export const Default = BasicInputField.bind({});
BasicInputField.args = {};

export const LightInput = Light.bind({});
BasicInputField.args = {};

export const CompactInput = CompactInputField.bind({});
CompactInputField.args = {};

export const ValidationInput = ValidationInputField.bind({});
ValidationInputField.args = {};

export const OnChangeInput = SetStateInputField.bind({});
SetStateInputField.args = {};
