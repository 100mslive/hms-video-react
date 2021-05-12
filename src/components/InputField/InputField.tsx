import React, { MouseEventHandler, PropsWithChildren } from 'react';
import { combineClasses } from '../../utils';
import { withClasses } from '../../utils/styles';
// TODO add a way to send styles
interface StyledInputFieldProps {
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
   * Default class names
   */
  defaultClasses?: InputFieldClasses;
  /**
   * Extra class names
   */
  classes?: InputFieldClasses;
}

export interface InputFieldClasses {
  root?: string;
  rootCompact?: string;
  rootNonCompact?: string;
  rootRing?: string;
  rootValidationRing?: string;
  rootValidationText?: string;
}

const defaultClasses: InputFieldClasses = {
  root:
    'placeholder-blueGray-300 relative bg-gray-200 text-white text-lg rounded-lg border-0 shadow outline-none focus:outline-none focus:ring w-full',
  rootCompact: `py-2 px-1`,
  rootNonCompact: `p-3`,
  rootRing: `ring-blue-300`,
  rootValidationRing: `ring-red-main`,
  rootValidationText: `text-red-main mt-2`,
};

export const StyledInputField: React.FC<PropsWithChildren<
  StyledInputFieldProps
>> = ({
  compact,
  validation,
  placeHolder,
  defaultClasses,
  classes: extraClasses,
  children,
  ...props
}) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const classList: string[] = [`${combinedClasses?.root}`];
  compact
    ? classList.push(`${combinedClasses?.rootCompact}`)
    : classList.push(`${combinedClasses?.rootNonCompact}`);
  validation
    ? classList.push(`${combinedClasses?.rootValidationRing}`)
    : classList.push(`${combinedClasses?.rootRing}`);
  return (
    <>
      <input
        placeholder={placeHolder}
        className={`${classList.join(' ')}`}
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

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledInputFieldProps
> &
  JSX.IntrinsicElements['input'];

export type InputFieldProps = Omit<StyledInputFieldProps, 'defaultClasses'> &
  NativeAttrs;

export const InputField = withClasses<InputFieldClasses | undefined>(
  defaultClasses,
  'input',
)<StyledInputFieldProps>(StyledInputField);
