import React, { PropsWithChildren } from 'react';
// @ts-ignore
import { style } from 'twind/style';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { resolveClasses } from '../../utils/classes/resolveClasses';

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
    'inline-flex text-white items-center justify-center text-base font-medium shadow-sm focus:outline-none',
  rootFocus: 'focus:ring focus:ring-brand-tint',
  rootDisabled: 'opacity-50 cursor-not-allowed', // TODO: disbaled hover state
  rootStandard: 'bg-gray-200 hover:bg-gray-300',
  rootDanger: 'bg-red-main hover:bg-red-tint',
  rootEmphasized: 'bg-brand-main hover:bg-brand-tint',
  rootNoFill: 'text-black shadow-none',
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
  const { tw } = useHMSTheme();
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
