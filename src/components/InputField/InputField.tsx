import React from 'react';

interface StyledInputField {
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
}

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledInputField
>;
export type InputFieldProps = StyledInputField & NativeAttrs;

const defaultClasses = {
  common: `placeholder-blueGray-300 relative bg-gray-200 text-white text-lg rounded-lg border-0 shadow outline-none focus:outline-none focus:ring w-full`,
  validation: `text-red-main mt-2`,
};

export const InputField: React.FC<InputFieldProps> = ({
  compact,
  validation,
  placeHolder,
  ...props
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder={placeHolder}
        className={`${defaultClasses['common']} ${
          validation ? 'ring-red-main' : 'ring-blue-300'
        } ${compact ? 'py-2 px-1' : 'p-3'}`}
        {...props}
      />
      {validation && (
        <p className={defaultClasses['validation']}>{validation}</p>
      )}
    </div>
  );
};
