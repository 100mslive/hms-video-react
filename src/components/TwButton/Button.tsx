import React, { PropsWithChildren } from 'react';
// @ts-ignore
import { tw, style } from 'twind/style';
// @ts-ignore
import { setup } from 'twind';
import { resolveClasses } from '../../utils/classes/resolveClasses';

// TODO: create a Global `tw` instance and hook
// TODO: for using tailwind config throughout
const colors = {
  blue: {
    tint: '#74AAFF',
    main: '#2F80FF',
    shade: '#0B326F',
  },
  red: {
    tint: '#E66977',
    main: '#D74451',
    shade: '#6F2229',
  },
  gray: {
    100: '#212121',
    200: '#3B3B3B',
    300: '#5E5E5E',
    400: '#8E8E8E',
    500: '#C7C7C7',
    600: '#E3E3E3',
    700: '#F2F2F2',
  },
  transparent: {
    100: 'rgba(0, 0, 0, 0.37)',
    200: 'rgba(196,196,196, 0.21) ',
    300: 'rgba(255, 255, 255, 0.25)',
    400: 'rgba(0, 0, 0, 0.75)',
    500: 'rgba(0, 0, 0, 0.9375)',
    600: 'rgba(59, 59, 59, 0.3)',
    700: 'rgba(0,0,0,0.22)',
    800: 'rgba(59,59,59,0.13)',
  },
};

setup({
  theme: {
    colors: colors,
  },
});

interface StyledButtonProps {
  /**
   * Variant
   */
  variant?: 'standard' | 'danger' | 'emphasized' | 'no-fill';
  /**
   * Size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Only Case
   */
  iconOnly?: boolean;
  /**
   * Icon Size
   */
  iconSize?: 'sm' | 'md' | 'lg';
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
  classes?: { [key: string]: string } | ButtonClasses;
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
  rootIconSizeSm: string;
  rootIconSizeMd: string;
  rootIconSizeLg: string;
}

const defaultClasses: ButtonClasses = {
  root:
    'inline-flex items-center justify-center text-base font-medium shadow-sm focus:outline-none',
  rootFocus: 'focus:ring focus:ring-blue-tint',
  rootDisabled: 'opacity-50 cursor-not-allowed', // TODO: disbaled hover state
  rootStandard: 'text-gray-700 bg-gray-200 hover:bg-gray-300',
  rootDanger: 'text-gray-700 bg-red-main hover:bg-red-tint',
  rootEmphasized: 'text-gray-700 bg-blue-main hover:bg-brand-tint',
  rootNoFill: 'text-gray-200 shadow-none',
  rootCircle: 'rounded-full',
  rootRectangle: 'rounded-lg',
  rootSizeSm: 'px-2.5 py-1.5',
  rootSizeMd: 'px-4 h-11',
  rootSizeLg: 'px-6 py-3',
  rootIconSizeSm: 'w-9 h-9',
  rootIconSizeMd: 'w-11 h-11 hover:bg-gray-100',
  rootIconSizeLg: 'w-14 h-14',
};

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
  const finalClasses: ButtonClasses = resolveClasses(
    classes || {},
    defaultClasses,
  );
  const button = style({
    base: `${finalClasses.root}`,
    variants: {
      variant: {
        standard: `${finalClasses.rootStandard}`,
        danger: `${finalClasses.rootDanger}`,
        emphasized: `${finalClasses.rootEmphasized}`,
        'no-fill': `${finalClasses.rootNoFill}`,
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
      },
      iconSize: {
        sm: `${finalClasses.rootIconSizeSm}`,
        md: `${finalClasses.rootIconSizeMd}`,
        lg: `${finalClasses.rootIconSizeLg}`,
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
          variant: variant,
          disabled: disabled,
          focus: focus,
          shape: shape,
          iconSize: iconSize,
        }),
      );
  // TODO: chaining descriptive classNames so that user knows which to override
  const propClass = 'hmsui-button';
  const className = tw(propClass, twClasses);
  return (
    <button type="button" className={className} {...props}>
      {icon && !iconRight && <span className="mr-2">{icon}</span>}
      {children}
      {iconRight && <span className="ml-2">{icon}</span>}
    </button>
  );
};
