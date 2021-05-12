import React, { PropsWithChildren } from 'react';
import { getInitialsFromName, combineClasses } from '../../utils';
import { withClasses } from '../../utils/styles';

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
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Default class names
   */
  defaultClasses?: AvatarClasses;
  /**
   * Extra class names
   */
  classes?: AvatarClasses;
}

export interface AvatarClasses {
  root: string;
  rootSizeSm: string;
  rootSizeMd: string;
  rootSizeLg: string;
  rootSizeXl: string;
  rootShapeCircle: string;
  rootShapeSquare: string;
  rootDivWrapper: string;
}

const defaultClasses: AvatarClasses = {
  root: 'object-cover',
  rootSizeSm: 'w-8 h-8 ',
  rootSizeMd: 'w-12 h-12',
  rootSizeLg: 'w-16 h-16 text-xl',
  rootSizeXl: 'w-28 h-28 text-4xl',
  rootShapeCircle: 'rounded-full',
  rootShapeSquare: 'rounded-lg',
  rootDivWrapper: 'flex text-center items-center justify-center',
};

export const StyledAvatar: React.FC<PropsWithChildren<StyledAvatarProps>> = ({
  size = 'sm',
  label,
  icon,
  image,
  shape = 'circle',
  defaultClasses,
  classes: extraClasses,
  ...props
}) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const tempDisplay = image || getInitialsFromName(label);
  const classList = [`${combinedClasses?.root}`];
  shape === 'circle'
    ? classList.push(`${combinedClasses?.rootShapeCircle}`)
    : classList.push(`${combinedClasses?.rootShapeSquare}`);
  if (!image) {
    classList.push(`${combinedClasses?.rootDivWrapper}`);
  }
  if (size === 'sm') {
    classList.push(`${combinedClasses?.rootSizeSm}`);
  } else if (size === 'md') {
    classList.push(`${combinedClasses?.rootSizeMd}`);
  } else if (size === 'lg') {
    classList.push(`${combinedClasses?.rootSizeLg}`);
  } else if (size === 'xl') {
    classList.push(`${combinedClasses?.rootSizeXl}`);
  }
  return (
    <>
      {image ? (
        <img
          {...props}
          className={classList.join(' ')}
          src={image}
          alt="Profile image"
        />
      ) : (
        <div
          {...props}
          className={classList.join(' ')}
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

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledAvatarProps
>;

export type AvatarProps = Omit<StyledAvatarProps, 'defaultClasses'> &
  NativeAttrs;

export const Avatar = withClasses<AvatarClasses | undefined>(
  defaultClasses,
  'avatar',
)<StyledAvatarProps>(StyledAvatar);
