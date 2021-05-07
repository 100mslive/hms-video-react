import React from 'react';

interface StyledTextProps {
  /**
   * Variant
   */
  variant?: 'heading' | 'body' | 'button';
  /**
   * Size
   */
  size?: 'sm' | 'md' | 'lg';
}

export interface TextClasses {}

const defaultClasses = {};

const Text = () => {
  return <p>Text Component</p>;
};

export default Text;
