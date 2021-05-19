import React, { useCallback } from 'react';
import { DownCaratIcon } from '../Icons';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface SelectClasses {
  container?: string;
  select?: string;
  icon?: string;
}

const defaultClasses: SelectClasses = {
  container: 'relative h-auto w-auto hover:opacity-80',
  select:
    'py-2 pl-3 pr-4 cursor-pointer appearance-none ring-blue-300 placeholder-blueGray-300 relative bg-gray-600 dark:bg-gray-200 text-gray-100 dark:text-white text-lg rounded-lg border-0 outline-none focus:outline-none focus:ring w-full',
  icon:
    'h-3 w-3 absolute cursor-pointer fill-current top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white right-3 pointer-events-none',
};
interface SelectWithoutNativeAttrs {
  classes?: SelectClasses;
}

export type SelectProps = SelectWithoutNativeAttrs &
  JSX.IntrinsicElements['select'];

export const Select: React.FC<SelectProps> = ({
  classes,
  children,
  ...props
}) => {
  const hu = useCallback(
    hmsUiClassParserGenerator<SelectClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-select',
    }),
    [],
  );

  return (
    <div className={`${hu('container')}`}>
      <select className={`${hu('select')}`} {...props}>
        {children}
      </select>
      <DownCaratIcon className={`${hu('icon')}`} />
    </div>
  );
};
