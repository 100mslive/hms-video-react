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
  rootIconOnlyStandard:string;
  rootIconOnlyDanger:string;
  rootIconOnlyStandardActive:string;
  rootIconOnlyDangerActive:string;
}

const defaultClasses: ButtonClasses = {
  root:
    'inline-flex items-center justify-center text-base font-medium focus:outline-none',
  rootFocus: 'focus:ring-brand-tint',
  rootDisabled: 'opacity-50 cursor-not-allowed', // TODO: disbaled hover state
  rootStandard: 'bg-gray-200 hover:bg-gray-300 text-white',
  rootDanger: 'bg-red-main hover:bg-red-tint text-white',
  rootEmphasized: 'bg-brand-main hover:bg-brand-tint text-white',
  rootNoFill: 'hover:opacity-80 shadow-none text-white',
  rootCircle: 'rounded-full',
  rootRectangle: 'rounded-lg',
  rootSizeSm: 'px-2.5 py-1.5',
  rootSizeMd: 'px-4 py-2',
  rootSizeLg: 'px-6 py-3',
  rootIconSizeSm: 'w-7 h-7 p-0.5 rounded-full',
  rootIconSizeMd: 'w-8 h-8 p-1',
  rootIconSizeLg: 'w-10 h-10 p-1',
  rootIconOnlyStandard:'text-black hover:bg-transparent-700 dark:text-white dark:hover:bg-transparent-300',
  rootIconOnlyDanger:'text-black hover:bg-transparent-700 dark:text-white dark:hover:bg-transparent-300',
  rootIconOnlyStandardActive:'dark:bg-white dark:text-black bg-gray-200 text-white',
  rootIconOnlyDangerActive:'bg-red-main hover:bg-red-tint text-white',
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
        iconOnlyStandard:`${finalClasses.rootIconOnlyStandard}`,
        iconOnlyDanger:`${finalClasses.rootIconOnlyDanger}`,
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
      active:{
        false:'',
        standard:`${finalClasses.rootIconOnlyStandardActive}`,
        danger:`${finalClasses.rootIconOnlyDangerActive}`
      }
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
          variant: variant==='danger'?'iconOnlyDanger':'iconOnlyStandard',
          disabled: disabled,
          focus: focus,
          shape: shape,
          iconSize: iconSize,
          active: (variant==='danger' && active && 'danger') || ((variant!=='danger' && active && 'standard'))
        }),
      );
  // TODO: chaining descriptive classNames so that user knows which to override
  const propClass = 'hmsui-button';
  const className = tw(propClass, twClasses);
  return (
    <button type="button" className={`${className} icon-size-${size}`} {...props}>
      {icon && !iconRight && <span className="mr-2 btn-icon flex items-center">{icon}</span>}
      {children}
      {iconRight && <span className="ml-2 btn-icon flex items-center">{icon}</span>}
    </button>
  );
};
