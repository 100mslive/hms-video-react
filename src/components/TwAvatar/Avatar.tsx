import React, { PropsWithChildren } from 'react';
import { getInitialsFromName } from '../../utils';

interface StyledAvatarProps {
  /**
   * Image URL to be displayed
   */
  image?: string;
  /**
   * Shape of the Avatar
   */
  shape?: 'square' | 'circle';
  /**
   * Icon component to be used. Ignored if image is present
   */
  icon?: React.ReactNode;
  /**
   * Name/Label of the person. Initials are used if no image/icon is present
   */
  label?: string;
  /**
   * Size of the Avatar
   */
  size?: 'sm' | 'md' | 'lg';
}

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledAvatarProps
>;
export type AvatarProps = StyledAvatarProps & NativeAttrs;

const defaultClasses = {
  size: {
    sm: 'w-8 h-8 ',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  },
  shape: {
    circle: 'rounded-full',
    square: 'rounded-lg',
  },
  type: {
    initial: 'flex text-center items-center justify-center',
  },
};

export const Avatar: React.FC<PropsWithChildren<AvatarProps>> = ({
  size,
  label,
  icon,
  image,
  shape,
  ...props
}) => {
  const resolveClasses = (
    size: StyledAvatarProps['size'],
    shape: StyledAvatarProps['shape'],
  ) => {
    const tempSize = size || 'sm';
    const tempShape = shape || 'circle';
    return `${defaultClasses['size'][tempSize]} ${defaultClasses['shape'][tempShape]}`;
  };
  const tempDisplay = image || getInitialsFromName(label);
  const defaultClassNames = `${resolveClasses(
    size,
    shape,
  )} inline object-cover`;
  return (
    <>
      {image ? (
        <img
          {...props}
          className={defaultClassNames}
          src={image}
          alt="Profile image"
        />
      ) : (
        <div
          {...props}
          className={`${defaultClassNames} ${defaultClasses['type']['initial']}`}
          style={{
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
              16,
            )}`,
          }}
        >
          {tempDisplay}
        </div>
      )}
    </>
  );
};
