import React, { useMemo } from 'react';
import { VolumeIcon, Logo } from '../Icons';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Text } from '../Text';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';

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
export const LogoButton = () => {
  let logo;
  try {
    const { appBuilder } = useHMSTheme();
    logo = appBuilder.logo;
  } catch (e) {}
  return (
    <button className=" p-2 focus:outline-none">
      {Boolean(logo) ? (
        <img
          src={logo}
          alt="brand_logo"
          // className=" md:object-contain object-scale-down md:h-full"
          className="object-contain flex justify-center h-6 "
        />
      ) : (
        <Logo />
      )}
    </button>
  );
};

export const Header = ({
  speaker,
  leftComponents = [<LogoButton key={0} />],
  centerComponents = [
    speaker ? (
      <div
        className={`self-center focus:outline-none text-lg flex items-center`}
        key={0}
      >
        <div className="inline-block">
          <VolumeIcon />
        </div>
        {/* TODO figure out why xs:hidden is needed */}
        <div className="md:pl-1 xs:hidden md:inline-block">
          <Text variant="body" size="md">
            {speaker}
          </Text>
        </div>
      </div>
    ) : (
      <></>
    ),
  ],
  rightComponents = [],
  classes,
}: HeaderProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<HeaderClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-header',
      }),
    [],
  );

  return (
    <div className={styler('root')}>
      <div className={styler('leftRoot')}>{leftComponents}</div>
      <div className={styler('centerRoot')}>{centerComponents}</div>
      <div className={styler('rightRoot')}>{rightComponents}</div>
    </div>
  );
};
