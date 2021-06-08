import React, { useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
interface InputPropsWithoutNativeAttrs {
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
  React.ComponentPropsWithoutRef<'input'>;

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

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      compact,
      validation,
      placeHolder,
      classes,
      children,
      ...props
    }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>,
  ) => {
    const { tw } = useHMSTheme();
    const styler = useMemo(
      () =>
        hmsUiClassParserGenerator<InputClasses>({
          tw,
          classes,
          defaultClasses,
          tag: 'hmsui-input',
        }),
      [],
    );

    return (
      <>
        <input
          ref={ref}
          placeholder={placeHolder}
          className={`${styler('root')} ${
            compact ? styler('rootCompact') : styler('rootNonCompact')
          } ${validation ? styler('rootValidationRing') : styler('rootRing')}`}
          {...props}
        >
          {children}
        </input>
        {validation && (
          <p className={`${styler('rootValidationText')}`}>{validation}</p>
        )}
      </>
    );
  },
);
