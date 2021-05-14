import React, { PropsWithChildren } from 'react';
import { tw, style, apply } from 'twind/style';
import { camelize, resolveClasses } from '../../utils/classes/resolveClasses';

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
  classes?: { [key: string]: string } | TextClasses;
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

export interface TextClasses {
  root: string;
  rootHeadingLg: string;
  rootHeadingMd: string;
  rootHeadingSm: string;
  rootBodyLg: string;
  rootBodyMd: string;
  rootBodySm: string;
  rootButtonLg: string;
}

const defaultClasses: TextClasses = {
  root: 'tracking-normal',
  rootHeadingLg: 'text-5xl font-semibold leading-7',
  rootHeadingMd: 'text-4xl font-medium leading-6',
  rootHeadingSm: 'text-3xl font-medium leading-6',
  rootBodyLg: 'text-base leading-5',
  rootBodyMd: 'text-sm leading-4',
  rootBodySm: 'text-xs leading-3',
  rootButtonLg: 'text-lg font-semibold leading-6',
};

export const Text: React.FC<PropsWithChildren<TextProps>> = ({
  tag,
  variant = 'body',
  size = 'lg',
  children,
  classes,
  styles,
  ...props
}) => {
  const finalClasses: TextClasses = resolveClasses(
    classes || {},
    defaultClasses,
  );
  const TagName = tag || 'p';
  const typography = style({
    // base
    base: `${finalClasses.root}`,
    matches: [
      {
        variant: 'heading',
        size: 'lg',
        use: `${finalClasses.rootHeadingLg}`,
      },
      {
        variant: 'heading',
        size: 'md',
        use: `${finalClasses.rootHeadingMd}`,
      },
      {
        variant: 'heading',
        size: 'sm',
        use: `${finalClasses.rootHeadingSm}`,
      },
      {
        variant: 'body',
        size: 'lg',
        use: `${finalClasses.rootBodyLg}`,
      },
      {
        variant: 'body',
        size: 'md',
        use: `${finalClasses.rootBodyMd}`,
      },
      {
        variant: 'body',
        size: 'sm',
        use: `${finalClasses.rootBodySm}`,
      },
      {
        variant: 'button',
        size: 'sm',
        use: `${finalClasses.rootButtonLg}`,
      },
    ],
  });
  const twClasses = typography({ size, variant });
  const propClass = `hmsui ${camelize(`root ${variant} ${size}`)}`;
  const className = tw(propClass, twClasses);
  return (
    <TagName className={className} {...props}>
      {children}
    </TagName>
  );
};
