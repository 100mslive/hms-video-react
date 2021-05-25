import React, { useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { SunWithFace } from '../Icons';
import { Text } from '../Text';
import { Button } from '../TwButton';

interface Props {
  username?: string;
  classes?: PostLeaveDisplayClasses;
}

interface PostLeaveDisplayClasses {
  root: string;
  rootBg: string;
  rootOverlay: string;
  sunnyFaceIconDiv: string;
  divider: string;
  buttonWrapper: string;
}

const PostLeaveDisplay: React.FC<Props> = ({
  username = 'Sanjana',
  classes,
}) => {
  const defaultClasses: PostLeaveDisplayClasses = {
    root: `h-full text-white flex items-center justify-center`,
    rootBg: `w-37.5 h-42.5 rounded-2xl`,
    rootOverlay: `relative rounded-2xl  flex flex-col text-center items-center space-y-6`,
    sunnyFaceIconDiv: `mt-24 mb-6`,
    divider: `bg-gray-600  h-px w-96 my-8`,
    buttonWrapper: `space-x-5`,
  };
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<PostLeaveDisplayClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-post-leave-display',
      }),
    [],
  );
  return (
    <div className={styler('root')}>
      <div
        className={styler('rootBg')}
        style={{
          backgroundImage: `url(https://i.postimg.cc/GtwwMnLL/back.png)`,
        }}
      >
        <div
          className={styler('rootOverlay')}
          style={{
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)`,
          }}
        >
          <div className={styler('sunnyFaceIconDiv')}>
            <SunWithFace />
          </div>
          <Text tag="h1" variant="heading">
            You left the room
          </Text>
          <Text tag="h1" variant="heading">
            Have a nice day, {username}
          </Text>
          <div className={styler('divider')}></div>
          <div className={styler('buttonWrapper')}>
            <Button variant="emphasized">Join Again</Button>
            <Button>Go to Dashboard</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLeaveDisplay;
