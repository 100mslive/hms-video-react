import React, { useCallback } from 'react';
import { VolumeIcon, Logo } from '../Icons';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface HeaderClasses {
  root?: string;
  leftRoot?: string;
  centerRoot?: string;
  rightRoot?: string;
}
export interface HeaderProps {
  time: number;
  speaker: string;
  leftComponents: Array<React.ReactNode>;
  centerComponents: Array<React.ReactNode>;
  rightComponents: Array<React.ReactNode>;
  classes?: HeaderClasses;
}

const defaultClasses: HeaderClasses = {
  root:
    'flex flex-grow bg-white text-gray-100 dark:bg-black dark:text-gray-500 h-7.5 items-center p-2 relative gap-x-4 self-center justify-center ',
  leftRoot:
    'flex md:flex-none text-black dark:text-white md:self-center md:justify-center md:left-0 md:ml-2 md:absolute',
  centerRoot:
    'md:flex md:flex-grow md:mr-2 md:self-center md:justify-center hidden md:visible',
  rightRoot:
    'flex md:flex-none md:right-0 md:absolute md:self-center md:p-3 md:mr-5',
};

export const Header = ({
  speaker,
  leftComponents = [<Logo />],
  centerComponents = [
    speaker ? (
      <div
        className={`self-center focus:outline-none text-lg flex items-center`}
      >
        <div className="inline-block">
          <VolumeIcon />
        </div>
        {/* TODO figure out why xs:hidden is needed */}
        <div className="md:pl-1 xs:hidden md:inline-block">{speaker}</div>
      </div>
    ) : (
      <></>
    ),
  ],
  rightComponents = [],
  classes,
}: HeaderProps) => {
  const hu = useCallback(
    hmsUiClassParserGenerator<HeaderClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-header',
    }),
    [],
  );

  return (
    <div className={hu('root')}>
      <div className={hu('leftRoot')}>{leftComponents}</div>
      <div className={hu('centerRoot')}>{centerComponents}</div>
      <div className={hu('rightRoot')}>{rightComponents}</div>
    </div>
  );
};
