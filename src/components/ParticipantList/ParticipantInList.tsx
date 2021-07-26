import React from 'react';
import { Avatar } from '../TwAvatar';
import { Button } from '../Button';
import { MicOffIcon, MicOnIcon, SettingsIcon } from '../Icons';
import { Text } from '../Text';
import { ParticipantListClasses } from './ParticipantProps';
import { StylerType } from '../../types';
import { HMSPeer } from '@100mslive/hms-video-store';

interface PropsType {
  styler?: StylerType<ParticipantListClasses>;
  name: string;
  isAudioEnabled?: boolean;
  onRoleChangeClick?: () => void;
  isLocal: boolean;
}

export const ParticipantInList = ({
  styler = () => '',
  name,
  isAudioEnabled,
  onRoleChangeClick,
  isLocal,
}: PropsType) => {
  return (
    <span className={styler('menuItem')} role="menuitem">
      <div className={styler('menuText')}>
        <Avatar label={name} shape="square" classes={{ root: 'mr-2' }} />
        <Text variant="body" classes={{ root: 'flex-1 truncate' }} title={name}>
          {name}
        </Text>
      </div>
      <div className={styler('menuIconContainer')}>
        {!isLocal && (
          <div>
            <Button
              iconOnly
              variant={'no-fill'}
              shape={'circle'}
              size={'sm'}
              onClick={onRoleChangeClick}
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
