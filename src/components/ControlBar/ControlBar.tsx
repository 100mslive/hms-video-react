import React from 'react';
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
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';

export interface ControlBarClasses {
  root?: string;
  leftRoot?: string;
  centerRoot?: string;
  rightRoot?: string;
}
interface StyledControlBarProps {
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
  defaultClasses?: ControlBarClasses;
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

function VerticleDevider(){
  return (
    <div className="w-px bg-gray-200 h-6">
    </div>
  )
}

export const StyledControlBar = ({
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
    <VerticleDevider />
    ,
    <TwButton
      iconOnly
      variant={'no-fill'}
      iconSize="md"
      shape={buttonDisplay}
      onClick={screenshareButtonOnClick}
      key={1}
    >
      <ShareScreenIcon />
    </TwButton>,
    <VerticleDevider />
    ,
    <TwButton
      iconOnly
      variant={'no-fill'}
      iconSize="md"
      shape={buttonDisplay}
      onClick={chatButtonOnClick}
      active={isChatOpen}
      key={2}
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
      active={isVideoMuted}
      onClick={videoButtonOnClick}
    >
      {isVideoMuted ? <CamOffIcon /> : <CamOnIcon />}
    </TwButton>,
    <TwButton
      iconOnly
      variant={'no-fill'}
      iconSize="md"
      shape={buttonDisplay}
      active={isAudioMuted}
      onClick={audioButtonOnClick}
    >
      {isAudioMuted ? <MicOffIcon /> : <MicOnIcon />}
    </TwButton>,
  ],
  rightComponents = [
    <TwButton
      size="md"
      shape={buttonDisplay}
      variant={'danger'}
      onClick={leaveButtonOnClick}
      icon={<HangUpIcon />}
    >
      Leave room
    </TwButton>,
  ],
  defaultClasses,
  classes: extraClasses,
}: StyledControlBarProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const leftItems = Array<React.ReactNode>();
  const centerItems = Array<React.ReactNode>();
  const rightItems = Array<React.ReactNode>();

  centerComponents.forEach(comp => {
    centerItems.push(comp);
  });
  rightComponents.forEach(comp => {
    rightItems.push(comp);
  });

  try {
    let context = useHMSTheme();
    leftItems.push(leftComponents[0]);

    if (
      context.appBuilder.enableScreenShare === undefined ||
      context.appBuilder.enableScreenShare
    ) {
      leftItems.push(leftComponents[1]);
    }
    if (
      context.appBuilder.enableChat === undefined ||
      Boolean(context.appBuilder.enableChat)
    ) {
      leftItems.push(leftComponents[2]);
    }
  } catch (e) {
    leftComponents.forEach(comp => {
      leftItems.push(comp);
    });
  }
  return (
    <div className={combinedClasses?.root}>
      <div className={combinedClasses?.leftRoot}>{leftItems}</div>
      <div className={combinedClasses?.centerRoot}>{centerItems}</div>
      <div className={combinedClasses?.rightRoot}>{rightItems}</div>
    </div>
  );
};

export type ControlBarProps = Omit<StyledControlBarProps, 'defaultClasses'>;

export const ControlBar = withClasses<ControlBarClasses | undefined>(
  defaultClasses,
  'controlbar',
)<StyledControlBarProps>(StyledControlBar);
