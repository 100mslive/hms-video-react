import React, { PropsWithChildren } from 'react';
import { tw, style } from 'twind/style';

type TextTags =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'b'
  | 'small'
  | 'i'
  | 'span'
  | 'del'
  | 'em'
  | 'blockquote';

interface StyledTextProps {
  /**
   * Variant
   */
  variant?: 'heading' | 'body' | 'button';
  /**
   * Size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * HTML Tag to Render
   */
  tag?: TextTags;
  /**
   * className string
   */
  className?: string;
  /**
   * css styles declaration
   */
  styles?: any;
}

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledTextProps
>;

export type TextProps = StyledTextProps & NativeAttrs;

export const Text: React.FC<PropsWithChildren<TextProps>> = ({
  tag,
  variant = 'body',
  size = 'lg',
  children,
  className,
  styles,
  ...props
}) => {
  const rootClass = `hmsui-typography-root`;
  const TagName = tag || 'p';
  const typography = style({
    // base
    base: `tracking-normal`,
    matches: [
      {
        variant: 'heading',
        size: 'lg',
        use: 'text-5xl font-semibold leading-7',
      },
      {
        variant: 'heading',
        size: 'md',
        use: 'text-4xl font-medium leading-6',
      },
      {
        variant: 'heading',
        size: 'sm',
        use: 'text-3xl font-medium leading-6',
      },
      {
        variant: 'body',
        size: 'lg',
        use: 'text-base leading-5',
      },
      {
        variant: 'body',
        size: 'md',
        use: 'text-sm leading-4',
      },
      {
        variant: 'body',
        size: 'sm',
        use: 'text-xs leading-3',
      },
      {
        variant: 'button',
        size: 'sm',
        use: 'text-lg font-semibold leading-6',
      },
    ],
  });
  let twClasses = className
    ? tw(`${rootClass}`, typography({ size, variant }), className)
    : tw(`${rootClass}`, typography({ size, variant }));
  twClasses = styles ? tw(twClasses, styles) : twClasses;
  return (
    <TagName className={twClasses} {...props}>
      {children}
    </TagName>
  );
};
