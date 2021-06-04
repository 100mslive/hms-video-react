import React, { useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { CrossIcon, ShareScreenIcon } from '../Icons';
import { Text } from '../Text';
import { Button } from '../Button';

interface Props {
  classes?: ScreenShareDisplayClasses;
  stopScreenShare: (event: React.MouseEvent) => void;
}

interface ScreenShareDisplayClasses {
  root: string;
  rootBg: string;
}

export const ScreenShareDisplay: React.FC<Props> = ({
  classes,
  stopScreenShare,
}) => {
  const defaultClasses: ScreenShareDisplayClasses = {
    root: `h-full text-white flex items-center justify-center`,
    rootBg: `w-37.5 h-37.5 rounded-2xl bg-gray-600 dark:bg-gray-100 dark:text-white text-black relative flex flex-col text-center space-y-6 justify-center items-center`,
  };
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ScreenShareDisplayClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-screen-share-display',
      }),
    [],
  );
  return (
    <div className={styler('root')}>
      <div className={styler('rootBg')}>
        <ShareScreenIcon width={100} height={100} />
        <Text tag="h1" variant="heading">
          You are sharing your screen
        </Text>
        <Button icon={<CrossIcon />} variant="danger" onClick={stopScreenShare}>
          Stop screen share
        </Button>
      </div>
    </div>
  );
};
