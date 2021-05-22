import React, { useCallback } from 'react';
import { ButtonDisplayType } from '../../types';
import {
  HangUpIcon,
  MicOffIcon,
  MicOnIcon,
  CamOffIcon,
  CamOnIcon,
  ChatIcon,
  ShareScreenIcon,
} from '../Icons';
import { Button as TwButton } from '../TwButton';
import { Settings } from '../Settings/Settings';
import { VerticalDivider } from '../VerticalDivider';
import { hmsUiClassParserGenerator } from '../../utils/classes';

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
  buttonDisplay: ButtonDisplayType;

  audioButtonOnClick: React.MouseEventHandler;
  videoButtonOnClick: React.MouseEventHandler;
  leaveButtonOnClick: React.MouseEventHandler;
  chatButtonOnClick: React.MouseEventHandler;
  screenshareButtonOnClick: React.MouseEventHandler;

  leftComponents: Array<React.ReactNode>;
  centerComponents: Array<React.ReactNode>;
  rightComponents: Array<React.ReactNode>;
  classes?: ControlBarClasses;
}

const defaultClasses: ControlBarClasses = {
  root:
    'flex flex-grow bg-white dark:bg-black h-full items-center p-3 relative gap-x-4 mr-2 ml-2 self-center justify-center',
  leftRoot:
    'flex md:flex-none md:self-center md:justify-center gap-x-4 md:left-0 md:ml-2 md:absolute items-center',
  centerRoot:
    'flex md:flex-grow gap-x-4 md:mr-2 md:self-center md:justify-center',
  rightRoot:
    'flex md:flex-none gap-x-4 md:right-0 md:absolute md:self-center md:p-3 md:mr-2',
};

export const ControlBar = ({
  isAudioMuted = false,
  isVideoMuted = false,
  isChatOpen = false,
  buttonDisplay = 'rectangle',
  audioButtonOnClick,
  videoButtonOnClick,
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
    <TwButton
      iconOnly
      variant={'no-fill'}
      iconSize="md"
      shape={buttonDisplay}
      onClick={screenshareButtonOnClick}
      key={2}
    >
      <ShareScreenIcon />
    </TwButton>,
    <VerticalDivider key={3} />,
    <TwButton
      iconOnly
      variant={'no-fill'}
      iconSize="md"
      shape={buttonDisplay}
      onClick={chatButtonOnClick}
      active={isChatOpen}
      key={4}
    >
      <ChatIcon />
    </TwButton>,
  ],
  centerComponents = [
    <TwButton
      iconOnly
      variant={'no-fill'}
      iconSize="md"
      shape={buttonDisplay}
      active={isAudioMuted}
      onClick={audioButtonOnClick}
      key={0}
    >
      {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
    </TwButton>,
    <TwButton
      iconOnly
      variant={'no-fill'}
      iconSize="md"
      shape={buttonDisplay}
      active={isVideoMuted}
      onClick={videoButtonOnClick}
      key={1}
    >
      {isVideoMuted ? <CamOffIcon /> : <CamOnIcon />}
    </TwButton>,
  ],
  rightComponents = [
    <TwButton
      size="md"
      shape={buttonDisplay}
      variant={'danger'}
      onClick={leaveButtonOnClick}
      icon={<HangUpIcon />}
      key={0}
    >
      Leave room
    </TwButton>,
  ],
  classes,
}: ControlBarProps) => {
  const combinedClasses = useCallback(
    hmsUiClassParserGenerator<ControlBarClasses>({
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
    <div className={combinedClasses('root')}>
      <div className={combinedClasses('leftRoot')}>{leftItems}</div>
      <div className={combinedClasses('centerRoot')}>{centerItems}</div>
      <div className={combinedClasses('rightRoot')}>{rightItems}</div>
    </div>
  );
};
