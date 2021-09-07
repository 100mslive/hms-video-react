import React, { PropsWithChildren } from 'react';
// @ts-ignore
import { style } from 'twind/style';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { resolveClasses } from '../../utils/classes';

interface StyledButtonProps {
  /**
   * Variant
   */
  variant?: 'standard' | 'danger' | 'emphasized' | 'no-fill';
  /**
   * Size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Only Case
   */
  iconOnly?: boolean;
  /**
   * Icon Size
   */
  iconSize?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Shape
   */
  shape?: 'circle' | 'rectangle';
  /**
   * focus state
   */
  focus?: boolean;
  /**
   * Variable denoting active state
   */
  active?: boolean;
  /**
   * Variable denoting disabled state
   */
  disabled?: boolean;
  /**
   * If Button has Icon
   */
  icon?: JSX.Element;
  /**
   * if Icon be to the Right
   */
  iconRight?: boolean;
  /**
   * className string
   */
  classes?: Partial<ButtonClasses>;
  /**
   * css styles declaration
   */
  styles?: any;
}

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledButtonProps
>;

export type ButtonProps = StyledButtonProps & NativeAttrs;

export interface ButtonClasses {
  root: string;
  rootFocus: string;
  rootDisabled: string;
  rootStandard: string;
  rootDanger: string;
  rootEmphasized: string;
  rootNoFill: string;
  rootCircle: string;
  rootRectangle: string;
  rootSizeSm: string;
  rootSizeMd: string;
  rootSizeLg: string;
  rootSizeXl: string;
  rootIconSizeSm: string;
  rootIconSizeMd: string;
  rootIconSizeLg: string;
  rootIconSizeXl: string;
  rootIconOnlyStandard: string;
  rootIconOnlyDanger: string;
  rootIconOnlyStandardActive: string;
  rootIconOnlyDangerActive: string;
}

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  variant = 'standard',
  shape = 'rectangle',
  active = false,
  disabled = false,
  focus = true,
  icon,
  classes,
  size = 'md',
  iconSize = 'md',
  iconOnly,
  iconRight,
  children,
  ...props
}) => {
  const ifDisabled = (s: string, d?: string) => (disabled ? d : s);
  const defaultClasses: ButtonClasses = {
    root: `inline-flex items-center justify-center text-base font-medium focus:outline-none ${ifDisabled(
      'focus-visible:ring-4 focus-visible:blue-tint',
    )}`,
    rootFocus: `focus:ring-brand-tint`,
    rootDisabled: `opacity-50 cursor-not-allowed ${
      variant !== 'no-fill' ? 'dark:bg-gray-100 bg-gray-600' : ''
    }`,
    rootStandard: `bg-gray-600 dark:bg-gray-200 text-black dark:text-white ${ifDisabled(
      'dark:hover:bg-gray-300 hover:bg-gray-500',
      'op-20 text-gray-400',
    )}`,
    rootDanger: `bg-red-main text-white  ${ifDisabled('hover:bg-red-tint')}`,
    rootEmphasized: `bg-brand-main text-white ${ifDisabled(
      'hover:bg-brand-tint',
    )}`,
    rootNoFill: `shadow-none text-white ${ifDisabled('hover:opacity-80')}`,
    rootCircle: `rounded-full`,
    rootRectangle: `rounded-lg`,
    rootSizeSm: `px-2.5 py-1.5`,
    rootSizeMd: `px-4 py-2`,
    rootSizeLg: `px-6 py-3`,
    rootSizeXl: `px-8 py-3`,
    rootIconSizeSm: `w-7 h-7 p-0.5 rounded-full`,
    rootIconSizeMd: `w-8 h-8 p-1`,
    rootIconSizeLg: `w-10 h-10 p-1`,
    rootIconSizeXl: 'w-11 h-11 p-1',
    rootIconOnlyStandard: `text-black dark:text-white ${ifDisabled(
      'hover:bg-transparent-700 dark:hover:bg-transparent-300',
    )}`,
    rootIconOnlyDanger: `text-black dark:text-white ${ifDisabled(
      'hover:bg-transparent-700 dark:hover:bg-transparent-300',
    )}`,
    rootIconOnlyStandardActive: `dark:bg-white dark:text-black bg-gray-200 text-white ${ifDisabled(
      'dark:hover:bg-white hover:bg-gray-200',
    )}`,
    rootIconOnlyDangerActive: `bg-red-main text-white dark:text-white ${ifDisabled(
      'hover:bg-red-main dark:hover:bg-red-main',
    )}`,
  };
  const { tw } = useHMSTheme();
  const finalClasses = resolveClasses<ButtonClasses>(defaultClasses, classes);
  const button = style({
    base: `${finalClasses.root}`,
    variants: {
      variant: {
        standard: `${finalClasses.rootStandard}`,
        danger: `${finalClasses.rootDanger}`,
        emphasized: `${finalClasses.rootEmphasized}`,
        'no-fill': `${finalClasses.rootNoFill}`,
        iconOnlyStandard: `${finalClasses.rootIconOnlyStandard}`,
        iconOnlyDanger: `${finalClasses.rootIconOnlyDanger}`,
      },
      disabled: {
        true: `${finalClasses.rootDisabled}`,
      },
      focus: {
        true: `${finalClasses.rootFocus}`,
      },
      shape: {
        rectangle: `${finalClasses.rootRectangle}`,
        circle: `${finalClasses.rootCircle}`,
      },
      size: {
        sm: `${finalClasses.rootSizeSm}`,
        md: `${finalClasses.rootSizeMd}`,
        lg: `${finalClasses.rootSizeLg}`,
        xl: `${finalClasses.rootSizeXl}`,
      },
      iconSize: {
        sm: `${finalClasses.rootIconSizeSm}`,
        md: `${finalClasses.rootIconSizeMd}`,
        lg: `${finalClasses.rootIconSizeLg}`,
        xl: `${finalClasses.rootIconSizeXl}`,
      },
      active: {
        false: '',
        standard: `${finalClasses.rootIconOnlyStandardActive}`,
        danger: `${finalClasses.rootIconOnlyDangerActive}`,
      },
    },
  });
  const twClasses = !iconOnly
    ? tw(
        button({
          variant: variant,
          disabled: disabled,
          focus: focus,
          shape: shape,
          size: size,
        }),
      )
    : tw(
        button({
          variant: variant === 'danger' ? 'iconOnlyDanger' : 'iconOnlyStandard',
          disabled: disabled,
          focus: focus,
          shape: shape,
          iconSize: iconSize,
          active:
            (variant === 'danger' && active && 'danger') ||
            (variant !== 'danger' && active && 'standard'),
        }),
      );
  // TODO: chaining descriptive classNames so that user knows which to override
  const propClass = 'hmsui-button';
  const className = tw(propClass, twClasses);
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${className} icon-size-${size}`}
      {...props}
    >
      {icon && !iconRight && (
        <span className="mr-2 btn-icon flex items-center">{icon}</span>
      )}
      {children}
      {iconRight && (
        <span className="ml-2 btn-icon flex items-center">{icon}</span>
      )}
    </button>
  );
};
