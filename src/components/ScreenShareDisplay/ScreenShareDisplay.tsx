import React, { useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { CrossIcon, ShareScreenIcon } from '../Icons';
import { Text } from '../Text';
import { Button } from '../TwButton';

interface Props {
  classes?: ScreenShareDisplayClasses;
}

interface ScreenShareDisplayClasses {
  root: string;
  rootBg: string;
}

const ScreenShareDisplay: React.FC<Props> = ({ classes }) => {
  const defaultClasses: ScreenShareDisplayClasses = {
    root: `h-full text-white flex items-center justify-center`,
    rootBg: `w-37.5 h-37.5 rounded-2xl bg-gray-100 relative flex flex-col text-center space-y-6 justify-center items-center`,
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
        <Button icon={<CrossIcon />} variant="danger">
          Stop screen share
        </Button>
      </div>
    </div>
  );
};

export default ScreenShareDisplay;
