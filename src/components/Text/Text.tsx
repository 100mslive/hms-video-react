import React, { PropsWithChildren } from 'react';
import { style } from 'twind/style';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { resolveClasses } from '../../utils/classes';

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
  classes?: Partial<TextClasses>;
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
  rootHeadingLg: 'text-heading-lg font-semibold',
  rootHeadingMd: 'text-heading-md font-medium ',
  rootHeadingSm: 'text-heading-sm font-medium',
  rootBodyLg: 'text-body-lg',
  rootBodyMd: 'text-body-md',
  rootBodySm: 'text-body-xs',
  rootButtonLg: 'text-button font-semibold',
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
  const finalClasses: TextClasses = resolveClasses(defaultClasses, classes);
  const { tw } = useHMSTheme();
  const TagName = tag || 'span';
  const typography = style({
    // base
    // @ts-ignore
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
        size: 'lg',
        use: `${finalClasses.rootButtonLg}`,
      },
    ],
  });
  // @ts-ignore
  const twClasses = typography({ size, variant });
  const className = tw(twClasses);
  return (
    <TagName className={className} {...props}>
      {children}
    </TagName>
  );
};
