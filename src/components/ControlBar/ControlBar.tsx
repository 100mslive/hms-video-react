import React, { useMemo } from 'react';
import { ButtonDisplayType } from '../../types';
import {
  HangUpIcon,
  MicOffIcon,
  MicOnIcon,
  CamOffIcon,
  CamOnIcon,
  ShareScreenIcon,
  ChatUnreadIcon,
  DetectOffIcon,
  DetectOnIcon,
} from '../Icons';
import { Button } from '../Button';
import { Settings } from '../Settings/Settings';
import { VerticalDivider } from '../VerticalDivider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';

export interface ControlBarClasses {
  root?: string;
  leftRoot?: string;
  centerRoot?: string;
  rightRoot?: string;
}
export interface ControlBarProps {
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  isChatOpen?: boolean;
  isDetecting?: boolean;
  isRendering?: boolean,
  buttonDisplay: ButtonDisplayType;

  audioButtonOnClick: React.MouseEventHandler;
  videoButtonOnClick: React.MouseEventHandler;
  detectButtonOnClick: React.MouseEventHandler;
  detectRenderingButtonOnClick: React.MouseEventHandler;
  leaveButtonOnClick: React.MouseEventHandler;
  chatButtonOnClick: React.MouseEventHandler;
  screenshareButtonOnClick: React.MouseEventHandler;

  leftComponents: Array<React.ReactNode>;
  centerComponents: Array<React.ReactNode>;
  rightComponents: Array<React.ReactNode>;
  classes?: ControlBarClasses;
}

// Note: Column Gap is not supported in safari
const defaultClasses: ControlBarClasses = {
  root:
    'flex bg-white dark:bg-black h-full items-center p-3 mr-2 ml-2 justify-center md:justify-between ',
  leftRoot: 'flex justify-center justify-between w-10 md:w-44',
  centerRoot: 'flex md:flex-1 mr-4 md:mr-0 justify-center',
  rightRoot: '',
};

export const ControlBar = ({
  isAudioMuted = false,
  isVideoMuted = false,
  isChatOpen = false,
  isDetecting = false,
  isRendering = true,
  buttonDisplay = 'rectangle',
  audioButtonOnClick,
  videoButtonOnClick,
  detectButtonOnClick,
  detectRenderingButtonOnClick,
  leaveButtonOnClick,
  chatButtonOnClick,
  screenshareButtonOnClick,
  leftComponents = [
    <Settings
      onChange={props => {
        console.debug('Settings on change called ', props);
      }}
      key={0}
    />,
    <VerticalDivider key={1} />,
    <Button
      iconOnly
      variant="no-fill"
      iconSize="md"
      classes={{ root: 'w-14' }}
      shape={buttonDisplay}
      onClick={screenshareButtonOnClick}
      key={2}
    >
      <ShareScreenIcon />
    </Button>,
    <VerticalDivider key={3} />,
    <Button
      iconOnly
      variant="no-fill"
      iconSize="md"
      shape={buttonDisplay}
      onClick={chatButtonOnClick}
      active={isChatOpen}
      key={4}
    >
      <ChatUnreadIcon />
    </Button>,
  ],
  centerComponents = [
    <Button
      iconOnly
      variant="no-fill"
      iconSize="md"
      classes={{ root: 'mr-2' }}
      shape={buttonDisplay}
      active={isAudioMuted}
      onClick={audioButtonOnClick}
      key={0}
    >
      {console.log("hgyh",isDetecting)}
      {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
    </Button>,
    <Button
      iconOnly
      variant="no-fill"
      iconSize="md"
      shape={buttonDisplay}
      active={isVideoMuted}
      onClick={videoButtonOnClick}
      key={1}
    >
      {isVideoMuted ? <CamOffIcon /> : <CamOnIcon />}
    </Button>,
     <Button
      iconOnly
      variant={'no-fill'}
      iconSize="md"
      shape={buttonDisplay}
      active={isDetecting}
      onClick={detectButtonOnClick}
      key={2}
     >
      {isDetecting ? <DetectOffIcon /> : <DetectOnIcon />}
    </Button>,
     <Button
      iconOnly
      variant={'no-fill'}
      iconSize="md"
      shape={buttonDisplay}
      active={isRendering}
      onClick={detectRenderingButtonOnClick}
      key={2}
     >
      {isRendering ? <DetectOffIcon /> : <DetectOnIcon />}
    </Button>,
    
  ],
  rightComponents = [
    <Button
      size="md"
      shape={buttonDisplay}
      variant="danger"
      onClick={leaveButtonOnClick}
      icon={<HangUpIcon />}
      key={0}
    >
      Leave room
    </Button>,
  ],
  classes,
}: ControlBarProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ControlBarClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-controlbar',
      }),
    [],
  );

  const leftItems = Array<React.ReactNode>();
  const centerItems = Array<React.ReactNode>();
  const rightItems = Array<React.ReactNode>();

  centerComponents.forEach(comp => {
    centerItems.push(comp);
  });
  rightComponents.forEach(comp => {
    rightItems.push(comp);
  });

  leftComponents.forEach(comp => {
    leftItems.push(comp);
  });

  return (
    <div className={styler('root')}>
      <div className={styler('leftRoot')}>{leftItems}</div>
      <div className={styler('centerRoot')}>{centerItems}</div>
      <div className={styler('rightRoot')}>{rightItems}</div>
    </div>
  );
};
