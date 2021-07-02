import React, { useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { isMobileDevice } from '../../utils';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Text } from '../Text';
import first_person_img from './first_person.png';

interface Props {
  username?: string;
  classes?: FirstPersonDisplayClasses;
  src?: string;
}

interface FirstPersonDisplayClasses {
  root: string;
  rootBg: string;
  content: string;
}

export const FirstPersonDisplay: React.FC<Props> = ({
  username = '',
  classes,
  src,
}) => {
  const defaultClasses: FirstPersonDisplayClasses = {
    root: 'h-full text-white flex items-center justify-center',
    rootBg:
      'w-37.5 h-42.5 rounded-2xl relative flex flex-col text-center space-y-4 justify-center items-center bg-contain',
    content: 'flex flex-col transform -translate-y-full mls:translate-y-0',
  };
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<FirstPersonDisplayClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-first-person-display',
      }),
    [],
  );
  return (
    <div className={styler('root')}>
      <div
        className={styler('rootBg')}
        style={{
          backgroundImage: `url(${src || first_person_img})`,
        }}
      >
        <div className={styler('content')}>
          <Text tag="h1" variant="heading">
            Welcome {username} !
          </Text>
          <div className="mt-2">
            <Text tag="p" variant="heading" size="sm">
              You’re the first one here.
            </Text>
            <Text tag="p" variant="heading" size="sm">
              Sit back and relax till the others join.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};
