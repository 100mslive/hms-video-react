import React, { useMemo, PropsWithChildren } from 'react';
import { getInitialsFromName } from '../../utils';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';

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
  avatarType?: 'initial' | 'icon' | 'image' | 'gradient';
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

const colorsArr = [
  '#F44336',
  '#3F51B5',
  '#4CAF50',
  '#FFA000',
  '#795548',
  '#E91E63',
  '#2F80FF',
  '#8BC34A',
  '#F57C00',
  '#4E342E',
  '#9C27B0',
  '#00BCD4',
  '#C0CA33',
  '#F4511E',
  '#616161',
  '#673AB7',
  '#009688',
  '#FBC02D',
  '#BF360C',
  '#455A64',
];

const gradArr = [
  ['#FAA49E', '#FF1908'],
  ['#92A1F1', '#394FC8'],
  ['#00B33D', ' #004106'],
  ['#FFB12D ', '#AB6B00 '],
  ['#B29287 ', '#8F5039 '],
  ['#FF548E ', '#BD0E4A '],
  ['#2F80FF ', '#054CBB '],
  ['#98E43F ', '#559906 '],
  ['#DD7000 ', '#663400 '],
  ['#966A60 ', '#4C1D12 '],
  ['#E449FF ', '#85059B '],
  ['#AEE9F0 ', '#09C3DA '],
  ['#E9F35B ', '#939D00 '],
  ['#FFD179 ', '#FF4004 '],
  ['#B6B6B6 ', '#5F5C5C '],
  ['#8750EA ', '#4511A0 '],
  ['#00E1CC ', '#008376 '],
  ['#F1D4A8 ', '#F1A40E '],
  ['#EC3F0A ', '#5E1600 '],
  ['#667D88 ', '#22566E '],
];

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
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<AvatarClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-avatar',
      }),
    [],
  );

  const classList = [`${styler('root')}`];
  shape === 'circle'
    ? classList.push(`${styler('rootShapeCircle')}`)
    : classList.push(`${styler('rootShapeSquare')}`);
  if (!image) {
    classList.push(`${styler('rootDivWrapper')}`);
  }
  if (size === 'sm') {
    classList.push(`${styler('rootSizeSm')}`);
  } else if (size === 'md') {
    classList.push(`${styler('rootSizeMd')}`);
  } else if (size === 'lg') {
    classList.push(`${styler('rootSizeLg')}`);
  } else if (size === 'xl') {
    classList.push(`${styler('rootSizeXl')}`);
  }

  const indexFactor = 20;
  const colorIndex = useMemo(
    () => ((label?.codePointAt(0) || 0) % indexFactor) + 1,
    [],
  );
  const map = {
    initial: (
      <div
        {...props}
        className={classList.join(' ')}
        style={{
          backgroundColor: `${colorsArr[colorIndex - 1]}`,
        }}
      >
        {getInitialsFromName(label)}
      </div>
    ),
    gradient: (
      <div
        {...props}
        className={classList.join(' ')}
        style={{
          background: `linear-gradient(180deg, ${
            gradArr[colorIndex - 1][0]
          } 0%, ${gradArr[colorIndex - 1][1]} 100%)`,
        }}
      >
        {getInitialsFromName(label)}
      </div>
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
