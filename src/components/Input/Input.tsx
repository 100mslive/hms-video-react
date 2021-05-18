import React, { useCallback } from 'react';
import { hmsUiClassParserGenerator } from '../../utils/classes';
interface InputPropsWithoutNativeAttrs{
  /**
   * Smaller Width for InputField
   */
  compact?: boolean;
  /**
   * Validation Text
   */
  validation?: string;
  /**
   * Placeholder Text
   */
  placeHolder?: string;
  /**
   * Extra class names
   */
  classes?: InputClasses;
}

export type InputProps = InputPropsWithoutNativeAttrs &
  JSX.IntrinsicElements['input'];

export interface InputClasses {
  root?: string;
  rootCompact?: string;
  rootNonCompact?: string;
  rootRing?: string;
  rootValidationRing?: string;
  rootValidationText?: string;
}

const defaultClasses: InputClasses = {
  root:
    'placeholder-gray-400 relative bg-gray-600 dark:bg-gray-200 text-gray-100 dark:text-white text-lg rounded-lg border-0 outline-none focus:outline-none focus:ring w-full',
  rootCompact: `py-2 px-3`,
  rootNonCompact: `p-3`,
  rootRing: `ring-blue-300`,
  rootValidationRing: `ring-red-main`,
  rootValidationText: `text-red-main mt-2`,
};

export const Input = ({
  compact,
  validation,
  placeHolder,
  classes,
  children,
  ...props
}:InputProps) => {
  const hu = useCallback(
    hmsUiClassParserGenerator<InputClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-input',
    }),
    [],
  );
  
  return (
    <>
      <input
        placeholder={placeHolder}
        className={`${hu('root')} ${compact?hu('rootCompact'):hu('rootNonCompact')} ${validation?hu('rootValidationRing'):hu('rootRing')}`}
        {...props}
      >
        {children}
      </input>
      {validation && (
        <p className={`${defaultClasses?.rootValidationText}`}>{validation}</p>
      )}
    </>
  );
};