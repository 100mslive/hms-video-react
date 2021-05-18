import React, { useCallback, PropsWithChildren } from 'react';
import { getInitialsFromName } from '../../utils';
import { hmsUiClassParserGenerator } from '../../utils/classes';
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
}

export type AvatarProps = AvatarPropsWithoutNativeAttrs & React.HTMLAttributes<HTMLImageElement>

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
  const tempDisplay = image || getInitialsFromName(label);
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