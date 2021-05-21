import React, { useCallback, PropsWithChildren } from 'react';
import { getInitialsFromName } from '../../utils';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Pebbles } from '../Icons/index';

interface AvatarPropsWithoutNativeAttrs {
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
  avatarType?: 'initial' | 'pebble' | 'icon' | 'image';
}

export type AvatarProps = AvatarPropsWithoutNativeAttrs &
  React.HTMLAttributes<HTMLImageElement>;

export interface AvatarClasses {
  root?: string;
  rootSizeSm?: string;
  rootSizeMd?: string;
  rootSizeLg?: string;
  rootSizeXl?: string;
  rootShapeCircle?: string;
  rootShapeSquare?: string;
  rootDivWrapper?: string;
}

const defaultClasses: AvatarClasses = {
  root: 'object-cover text-white',
  rootSizeSm: 'w-8 h-8 ',
  rootSizeMd: 'w-12 h-12',
  rootSizeLg: 'w-16 h-16 text-xl',
  rootSizeXl: 'w-28 h-28 text-4xl',
  rootShapeCircle: 'rounded-full',
  rootShapeSquare: 'rounded-lg',
  rootDivWrapper: 'flex text-center items-center justify-center',
};

export const Avatar: React.FC<PropsWithChildren<AvatarProps>> = ({
  size = 'sm',
  label,
  icon,
  image,
  shape = 'circle',
  classes,
  avatarType = 'initial',
  ...props
}) => {
  const hu = useCallback(
    hmsUiClassParserGenerator<AvatarClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-avatar',
    }),
    [],
  );

  if (avatarType === 'pebble') shape = 'square';
  const classList = [`${hu('root')}`];
  shape === 'circle'
    ? classList.push(`${hu('rootShapeCircle')}`)
    : classList.push(`${hu('rootShapeSquare')}`);
  if (!image) {
    classList.push(`${hu('rootDivWrapper')}`);
  }
  if (size === 'sm') {
    classList.push(`${hu('rootSizeSm')}`);
  } else if (size === 'md') {
    classList.push(`${hu('rootSizeMd')}`);
  } else if (size === 'lg') {
    classList.push(`${hu('rootSizeLg')}`);
  } else if (size === 'xl') {
    classList.push(`${hu('rootSizeXl')}`);
  }
  const pebble = ((label?.codePointAt(0) || 0) % 6) + 1;
  const map = {
    initial: (
      <div
        {...props}
        className={classList.join(' ')}
        style={{
          backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
            16,
          )}`,
        }}
      >
        {getInitialsFromName(label)}
      </div>
    ),
    pebble: (
      <img
        {...props}
        className={classList.join(' ')}
        src={`https://bc-public-static-assets.s3.ap-south-1.amazonaws.com/dashboard/images/Pebble%20People/${
          pebble == 5 ? 3 : pebble
        }.svg`}
      />
    ),
    icon: (
      <div
        {...props}
        className={classList.join(' ')}
        style={{
          backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
            16,
          )}`,
        }}
      >
        {icon}
      </div>
    ),
    image: (
      <img
        {...props}
        className={classList.join(' ')}
        src={image}
        alt="Profile image"
      />
    ),
  };
  return <>{map[avatarType]}</>;
};
