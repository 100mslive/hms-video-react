import React, { Fragment } from 'react';
import { Avatar } from '../TwAvatar';
import { Button } from '../Button';
import { HandFilledIcon, MicOffIcon, MicOnIcon, SettingsIcon } from '../Icons';
import { Text } from '../Text';
import { ParticipantListClasses } from './ParticipantProps';
import { StylerType } from '../../types';
import {
  selectIsPeerAudioEnabled,
  selectPermissions,
} from '@100mslive/hms-video-store';
import { useHMSStore } from '../../hooks/HMSRoomProvider';

interface PropsType {
  styler?: StylerType<ParticipantListClasses>;
  name: string;
  peerId: string;
  onUserSettingsClick?: () => void;
  isHandRaised?: boolean;
}

const Icons = ({
  styler = () => '',
  peerId,
  onUserSettingsClick,
  isHandRaised,
}: Omit<PropsType, 'name'>) => {
  const permissions = useHMSStore(selectPermissions);
  const isAudioEnabled = useHMSStore(selectIsPeerAudioEnabled(peerId));
  return (
    <Fragment>
      {permissions?.changeRole && (
        <div>
          <Button
            iconOnly
            variant="no-fill"
            shape="circle"
            size="sm"
            onClick={onUserSettingsClick}
            key="settingsIcon"
          >
            <SettingsIcon />
          </Button>
        </div>
      )}
      <div className={isAudioEnabled ? styler('onIcon') : styler('offIcon')}>
        <Button iconOnly shape="circle" size="sm" variant="no-fill">
          {isAudioEnabled ? <MicOnIcon /> : <MicOffIcon />}
        </Button>
      </div>
      {isHandRaised && (
        <div>
          <Button iconOnly shape="circle" size="md" variant="no-fill">
            <HandFilledIcon width="24" height="24" />
          </Button>
        </div>
      )}
    </Fragment>
  );
};

const ListItem = ({
  styler = () => '',
  name,
  peerId,
  onUserSettingsClick,
  isHandRaised,
}: PropsType) => {
  return (
    <span className={styler('menuItem')} role="menuitem">
      <div className={styler('menuText')}>
        <Avatar
          label={name}
          key={name}
          shape="square"
          size="sm"
          classes={{ root: 'mr-2' }}
        />
        <Text variant="body" className={styler('expanded')} title={name}>
          {name}
        </Text>
      </div>
      <div className={styler('menuIconContainer')}>
        <Icons
          styler={styler}
          peerId={peerId}
          onUserSettingsClick={onUserSettingsClick}
          isHandRaised={isHandRaised}
        />
      </div>
    </span>
  );
};

export const ParticipantInList = React.memo(
  ListItem,
  (prev, next) => prev.peerId === next.peerId,
);
