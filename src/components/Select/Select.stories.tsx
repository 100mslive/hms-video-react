import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Select, SelectProps } from './index';
import { HMSThemeProvider } from '../../hooks/HMSThemeProvider';

const meta: Meta = {
  title: 'Select',
  component: Select,
};

export default meta;

const BasicSelectField: Story<SelectProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'dark' }}>
      <div className="w-full bg-black py-10">
        <div className="w-1/3 mx-auto">
          <Select {...args} />
        </div>
      </div>
    </HMSThemeProvider>
  );
};

const Light: Story<SelectProps> = args => {
  return (
    <HMSThemeProvider config={{}} appBuilder={{ theme: 'light' }}>
      <div className="w-full bg-white py-10">
        <div className="w-1/3 mx-auto">
          <Select {...args} />
        </div>
      </div>
    </HMSThemeProvider>
  );
};

export const Default = BasicSelectField.bind({});
const options = ["Kheer Ganga", "Hampi", "Ooty", "Manali"].map(o => <option>{o}</option>)
Default.args = {children: options};

export const LightSelect = Light.bind({});
LightSelect.args = {children: options};
