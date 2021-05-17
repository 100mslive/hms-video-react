import React from 'react';
import {
  DownCaratIcon,
} from '../Icons';
interface StyledSelect {}

type NativeAttrs = Omit<React.DetailsHTMLAttributes<any>, keyof StyledSelect>;
export type SelectProps = StyledSelect &
  NativeAttrs &
  JSX.IntrinsicElements['select'];

const defaultClasses = {};

export const Select: React.FC<SelectProps> = ({ ...props }) => {
  return (
    <div className="relative h-auto w-auto hover:opacity-80">
      <select
      name="Pets"
      className="py-2 pl-3 pr-4 cursor-pointer appearance-none ring-blue-300 placeholder-blueGray-300 relative bg-gray-200 text-white text-lg rounded-lg border-0 shadow outline-none focus:outline-none focus:ring w-full"
      >
      <option value="dog">Duma</option>
      <option value="bird">Danillo</option>
      <option value="cat">Guilia</option>
    </select>
    <DownCaratIcon className='h-3 w-3 absolute cursor-pointer fill-current top-1/2 transform -translate-y-1/2 text-white right-3' />
    </div>
  );
};
