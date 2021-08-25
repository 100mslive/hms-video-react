import React from 'react';
import { Avatar } from '../TwAvatar';
import { Button } from '../Button';
import { MicOffIcon, MicOnIcon, SettingsIcon } from '../Icons';
import { Text } from '../Text';
import { ParticipantListClasses } from './ParticipantProps';
import { StylerType } from '../../types';
import { HMSPeer, selectLocalPeerRole } from '@100mslive/hms-video-store';
import { useHMSStore } from '../../hooks/HMSRoomProvider';

interface PropsType {
  styler?: StylerType<ParticipantListClasses>;
  name: string;
  isAudioEnabled?: boolean;
  onUserSettingsClick?: () => void;
  isLocal: boolean;
}

export const ParticipantInList = ({
  styler = () => '',
  name,
  isAudioEnabled,
  onUserSettingsClick,
  isLocal,
}: PropsType) => {
  const localPeerRole = useHMSStore(selectLocalPeerRole);

  return (
    <span className={styler('menuItem')} role="menuitem">
      <div className={styler('menuText')}>
        <Avatar label={name} shape="square" classes={{ root: 'mr-2' }} />
        <Text variant="body" className={styler('expanded')} title={name}>
          {name}
        </Text>
      </div>
      <div className={styler('menuIconContainer')}>
        {localPeerRole?.permissions.changeRole && (
          <div>
            <Button
              iconOnly
              variant="no-fill"
              shape="circle"
              size="sm"
              onClick={onUserSettingsClick}
            >
              <SettingsIcon />
            </Button>
          </div>
        )}
        {isAudioEnabled ? (
          <div className={styler('onIcon')}>
            <Button iconOnly shape={'circle'} size={'sm'}>
              <MicOnIcon />
            </Button>
          </div>
        ) : (
          <div className={styler('offIcon')}>
            <Button
              iconOnly
              shape={'circle'}
              variant={'danger'}
              size={'sm'}
              active={isAudioEnabled}
            >
              <MicOffIcon />
            </Button>
          </div>
        )}
      </div>
    </span>
  );
};
