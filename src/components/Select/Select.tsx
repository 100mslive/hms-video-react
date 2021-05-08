import React from 'react';

interface StyledSelect {}

type NativeAttrs = Omit<React.DetailsHTMLAttributes<any>, keyof StyledSelect>;
export type SelectProps = StyledSelect &
  NativeAttrs &
  JSX.IntrinsicElements['select'];

const defaultClasses = {};

export const Select: React.FC<SelectProps> = ({ ...props }) => {
  return (
    <select
      name="Pets"
      className="p-3 ring-blue-300 placeholder-blueGray-300 relative bg-gray-200 text-white text-lg rounded-lg border-0 shadow outline-none focus:outline-none focus:ring w-full"
    >
      <option value="dog">Duma</option>
      <option value="bird">Danillo</option>
      <option value="cat">Guilia</option>
    </select>
  );
};
