import { StylerType } from '../../types';
import { Avatar } from '../TwAvatar';
import { Button } from '../Button';
import { MicOffIcon, MicOnIcon } from '../Icons';
import React from 'react';
import { ParticipantListClasses } from './ParticipantProps';

interface PropsType {
  styler?: StylerType<ParticipantListClasses>;
  name: string;
  isAudioEnabled?: boolean;
}

export const ParticipantInList = ({
  styler = () => '',
  name,
  isAudioEnabled,
}: PropsType) => {
  return (
    <span className={`${styler('menuItem')}`} role="menuitem">
      <div className={`${styler('menuText')}`}>
        <Avatar label={name} shape="square" classes={{ root: 'mr-2' }} />
        {name}
      </div>
      <div className={`${styler('menuIconContainer')}`}>
        {isAudioEnabled ? (
          <div className={`${styler('onIcon')}`}>
            <Button iconOnly shape={'circle'} size={'sm'}>
              <MicOnIcon />
            </Button>
          </div>
        ) : (
          <div className={`${styler('offIcon')}`}>
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
