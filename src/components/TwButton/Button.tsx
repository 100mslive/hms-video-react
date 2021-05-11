import React, { PropsWithChildren } from 'react';
import { tw, style } from 'twind/style';
import { setup } from 'twind';

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
  rootIcon: string;
  rootSizeSm: string;
  rootSizeMd: string;
  rootSizeLg: string;
}

const defaultClasses: ButtonClasses = {
  root:
    'inline-flex items-center text-base font-medium shadow-sm focus:outline-none',
  rootFocus: 'focus:ring focus:ring-blue-tint',
  rootDisabled: 'opacity-50 cursor-not-allowed', // TODO: disbaled hover state
  rootStandard: 'text-gray-700 bg-gray-200 hover:bg-gray-300',
  rootDanger: 'text-gray-700 bg-red-main hover:bg-red-tint',
  rootEmphasized: 'text-gray-700 bg-blue-main hover:bg-brand-tint',
  rootNoFill: 'text-gray-200 shadow-none',
  rootCircle: 'rounded-full',
  rootRectangle: 'rounded-lg',
  rootIcon: 'space-between',
  rootSizeSm: 'px-2.5 py-1.5',
  rootSizeMd: 'px-4 py-2',
  rootSizeLg: 'px-6 py-3',
};

export const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  variant = 'standard',
  shape = 'rectangle',
  active = false,
  disabled = false,
  focus = true,
  icon,
  size = 'md',
  iconRight,
  children,
  ...props
}) => {
  const button = style({
    base: `${defaultClasses.root}`,
    variants: {
      variant: {
        standard: `${defaultClasses.rootStandard}`,
        danger: `${defaultClasses.rootDanger}`,
        emphasized: `${defaultClasses.rootEmphasized}`,
        'no-fill': `${defaultClasses.rootNoFill}`,
      },
      disabled: {
        true: `${defaultClasses.rootDisabled}`,
      },
      focus: {
        true: `${defaultClasses.rootFocus}`,
      },
      icon: {
        true: `${defaultClasses.rootIcon}`,
      },
      shape: {
        rectangle: `${defaultClasses.rootRectangle}`,
        circle: `${defaultClasses.rootCircle}`,
      },
      size: {
        sm: `${defaultClasses.rootSizeSm}`,
        md: `${defaultClasses.rootSizeMd}`,
        lg: `${defaultClasses.rootSizeLg}`,
      },
    },
  });
  const className = tw(
    button({
      variant: variant,
      disabled: disabled,
      focus: focus,
      shape: shape,
      size: size,
    }),
  );
  return (
    <button type="button" className={className} {...props}>
      {icon && !iconRight && <span className="mr-2">{icon}</span>}
      {children}
      {iconRight && <span className="ml-2">{icon}</span>}
    </button>
  );
};
