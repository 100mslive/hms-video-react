import React, { PropsWithChildren } from 'react';

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
}

const defaultClasses = {
  heading: {
    lg: 'text-5xl font-semibold leading-7',
    md: 'text-4xl font-medium leading-6',
    sm: 'text-3xl font-medium leading-6',
  },
  body: {
    lg: 'text-base leading-5', // default
    md: 'text-sm leading-4',
    sm: 'text-xs leading-3',
  },
  button: 'text-lg font-semibold leading-6',
};

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledTextProps
>;
export type TextProps = StyledTextProps & NativeAttrs;

export const Text: React.FC<PropsWithChildren<TextProps>> = ({
  tag,
  variant,
  size,
  children,
  ...props
}) => {
  const TagName = tag || 'p';
  const defaultClassNames = 'tracking-normal';
  const resolveClasses = (
    v: StyledTextProps['variant'],
    s: StyledTextProps['size'],
  ) => {
    const tempVariant = v || 'body';
    const tempSize = s || 'lg';
    return tempVariant !== 'button'
      ? defaultClasses[tempVariant][tempSize]
      : defaultClasses['button'];
  };
  const tempClassName = `${resolveClasses(variant, size)} ${defaultClassNames}`;
  return (
    <TagName className={tempClassName} {...props}>
      {children}
    </TagName>
  );
};
