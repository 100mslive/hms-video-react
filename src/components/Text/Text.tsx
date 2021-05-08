import React, { PropsWithChildren } from 'react';
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';

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
   * Default class names
   */
  defaultClasses?: TextClasses;
  /**
   * Extra class names
   */
  classes?: TextClasses;
}

export interface TextClasses {
  root: string;
  rootHeadingLg: string;
  rootHeadingMd: string;
  rootHeadingSm: string;
  rootBodyLg: string;
  rootBodyMd: string;
  rootBodySm: string;
  rootButton: string;
}

const defaultClasses: TextClasses = {
  root: 'tracking-normal',
  rootHeadingLg: 'text-5xl font-semibold leading-7',
  rootHeadingMd: 'text-4xl font-medium leading-6',
  rootHeadingSm: 'text-3xl font-medium leading-6',
  rootBodyLg: 'text-base leading-5', // default
  rootBodyMd: 'text-sm leading-4',
  rootBodySm: 'text-xs leading-3',
  rootButton: 'text-lg font-semibold leading-6',
};

export const StyledText: React.FC<PropsWithChildren<StyledTextProps>> = ({
  tag,
  variant = 'body',
  size = 'lg',
  children,
  defaultClasses,
  classes: extraClasses,
  ...props
}) => {
  const TagName = tag || 'p';
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const classList: string[] = [`${combinedClasses?.root}`];
  if (variant === 'body') {
    if (size === 'sm') {
      classList.push(`${combinedClasses?.rootBodySm}`);
    } else if (size === 'md') {
      classList.push(`${combinedClasses?.rootBodyMd}`);
    } else if (size === 'lg') {
      classList.push(`${combinedClasses?.rootBodyLg}`);
    }
  } else if (variant === 'heading') {
    if (size === 'sm') {
      classList.push(`${combinedClasses?.rootHeadingSm}`);
    } else if (size === 'md') {
      classList.push(`${combinedClasses?.rootHeadingMd}`);
    } else if (size === 'lg') {
      classList.push(`${combinedClasses?.rootHeadingLg}`);
    }
  } else if (variant === 'button') {
    classList.push(`${combinedClasses?.rootButton}`);
  }

  return (
    <TagName className={`${classList.join(' ')}`} {...props}>
      {children}
    </TagName>
  );
};

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledTextProps
>;

export type TextProps = Omit<StyledTextProps, 'defaultClasses'> & NativeAttrs;

export const Text = withClasses<TextClasses | undefined>(
  defaultClasses,
  'text',
)<StyledTextProps>(StyledText);
