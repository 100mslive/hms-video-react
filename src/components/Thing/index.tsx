import React from 'react';

export interface Props {
  /** custom content, defaults to 'the snozzberries taste like snozzberries' */
  children?: React.ReactChild;
}

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const Thing = ({ children }: Props) => {
  return (
    <div className="p-3 text-center text-blue-main bg-gray-500 shadow-xl rounded-2xl">
      {children || `the snozzberries taste like snozzberries`}
    </div>
  );
};
