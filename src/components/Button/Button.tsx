import React from 'react';
import { combineClasses } from '../../utils';
import { withClasses } from '../../utils/styles';

interface StyledButtonProps {
  /**
   * Variant
   */
  variant?: 'standard' | 'danger' | 'emphasized' | 'no-fill' | 'icon-only';
  /**
   * Size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Shape
   */
  shape?: 'circle' | 'rectangle';
  /**
   * Variable denoting active state
   */
  active?: boolean;
  /**
   * Variable denoting disabled state
   */
  disabled?: boolean;
  /**
   * Method to call on click
   */
  onClick?: () => any;
  /**
   * Default class names
   */
  defaultClasses?: ButtonClasses;
  /**
   * Extra class names
   */
  classes?: ButtonClasses;
}

export interface ButtonClasses {
  root?: string;
  rootStandard?: string;
  rootDanger?: string;
  rootEmphasized?: string;
  rootNoFill?: string;
  rootIconOnly?: string;
  rootSm?: string;
  rootMd?: string;
  rootLg?: string;
  rootCircle?: string;
  rootRectangle?: string;
  rootDisabled?: string;
  iconOnlyActive?: string;
  noFillDisabled?: string;
  iconOnlyDisabled?: string;
  iconOnlySm?: string;
  iconOnlyMd?: string;
  iconOnlyLg?: string;
  container?: string;
}

const defaultClasses = {
  root:
    'box-border text-gray-100 dark:text-white focus:outline-none focus:border-blue-tint overflow-hidden flex flex-row items-center overflow-hidden rounded-lg',
  rootStandard:
    'bg-gray-600 dark:bg-gray-200 hover:gray-500 dark:hovergray-300 focus:gray-600  dark:focus:gray-200',
  rootDanger: 'bg-red-main hover:bg-red-tint text-white',
  rootEmphasized: 'bg-blue-main hover:bg-blue-tint text-white',
  rootNoFill: 'dark:text-blue-main dark:hover:text-blue-tint text-white',
  rootIconOnly: 'hover:bg-gray-500 focus:bg-none',
  iconOnlyActive: 'bg-gray-200 text-white dark:bg-white dark:text-black',
  rootDisabled:
    'text-transaprent-700 bg-transparent-800 dark:text-transparent-300 dark:bg-transparent-200',
  noFillDisabled: 'text-blue-shade dark:text-transparent-300',
  iconOnlySm: 'px-0.5 py-0.5 text-sm',
  iconOnlyMd: 'px-1.5 py-1.5 text-md',
  iconOnlyLg: 'px-2 py-2 text-lg',
  rootSm: 'px-2 py-0.5 focus:border-2 text-sm',
  rootMd: 'px-3.5 py-1 focus:border-2 text-md',
  rootLg: 'px-5 py-2.5 focus:border-3 text-lg',
  rootCircle: 'rounded-full',
};

export const StyledButton: React.FC<StyledButtonProps> = ({
  variant = 'standard',
  size = 'lg',
  shape = 'rectangle',
  active = false,
  disabled = false,
  onClick,
  defaultClasses,
  classes: extraClasses,
  children,
}) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);

  return (
    <>
      <button
        className={`${combinedClasses?.root}
                                ${
                                  variant === 'standard'
                                    ? `${combinedClasses?.rootStandard}`
                                    : ''
                                }                                                            
                                ${
                                  variant === 'danger'
                                    ? `${combinedClasses?.rootDanger}`
                                    : ''
                                }                                                            
                                ${
                                  variant === 'emphasized'
                                    ? `${combinedClasses?.rootEmphasized}`
                                    : ''
                                }                                                            
                                ${
                                  variant === 'no-fill'
                                    ? `${combinedClasses?.rootNoFill}`
                                    : ''
                                }                                                            
                                ${
                                  variant === 'icon-only'
                                    ? `${combinedClasses?.rootIconOnly}`
                                    : ''
                                }                                                            
                                ${
                                  size === 'lg' && variant !== 'icon-only'
                                    ? `${combinedClasses?.rootLg}`
                                    : ''
                                }                                                            
                                ${
                                  size === 'md' && variant !== 'icon-only'
                                    ? `${combinedClasses?.rootMd}`
                                    : ''
                                }                                                            
                                ${
                                  size === 'sm' && variant !== 'icon-only'
                                    ? `${combinedClasses?.rootSm}`
                                    : ''
                                }                                                            
                                ${
                                  disabled
                                    ? `${combinedClasses?.rootDisabled}`
                                    : ''
                                }                                                            
                                ${
                                  size === 'lg' && variant === 'icon-only'
                                    ? `${combinedClasses?.iconOnlyLg}`
                                    : ''
                                }                                                            
                                ${
                                  size === 'md' && variant === 'icon-only'
                                    ? `${combinedClasses?.iconOnlyMd}`
                                    : ''
                                }                                                            
                                ${
                                  size === 'sm' && variant === 'icon-only'
                                    ? `${combinedClasses?.iconOnlySm}`
                                    : ''
                                }                                                            
                                ${
                                  disabled && variant === 'no-fill'
                                    ? `${combinedClasses?.noFillDisabled}`
                                    : ''
                                }                                                            
                                ${
                                  active && variant === 'icon-only'
                                    ? `${combinedClasses?.iconOnlyActive}`
                                    : ''
                                }
                                ${
                                  shape === 'circle'
                                    ? `${combinedClasses?.rootCircle}`
                                    : ''
                                } 
                                ${
                                  variant === 'icon-only'
                                    ? `${combinedClasses?.iconOnlySm} md:(${combinedClasses?.iconOnlyMd}) lg:(${combinedClasses?.iconOnlyLg})`
                                    : `${combinedClasses?.rootSm} md:(${combinedClasses?.rootMd}) lg:(${combinedClasses?.rootLg})`
                                }                                                           
                            `}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};

export type ButtonProps = Omit<StyledButtonProps, 'defaultClasses'>;

export const Button = withClasses<ButtonClasses | undefined>(
  defaultClasses,
  'button',
)<StyledButtonProps>(StyledButton);
