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

export interface TextClasses {}

const defaultClasses = {};

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledTextProps
>;
export type TextProps = StyledTextProps & NativeAttrs;

const Text: React.FC<PropsWithChildren<TextProps>> = ({
  tag,
  variant,
  size,
  children,
}) => {
  const TagName = tag || 'p';
  return <TagName>{children}</TagName>;
};

export default Text;
