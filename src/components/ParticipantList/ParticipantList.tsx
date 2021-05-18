import React, { useCallback, useState } from 'react';
import {
  DownCaratIcon,
  UpCaratIcon,
  MicOffIcon,
  MicOnIcon,
} from '../Icons';
import { Participant } from '../../types';
import { Button } from '../TwButton';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { groupBy } from 'lodash';
import './index.css';
import { Avatar } from '../TwAvatar';

interface ParticipantListClasses {
  root?: string;
  buttonRoot?: string;
  buttonOpen?: string;
  buttonClosed?: string;
  buttonInner?: string;
  buttonText?: string;
  carat?: string;
  menuRoot?: string;
  menuSection?: string;
  menuItem?: string;
  menuText?: string;
  menuIconContainer?: string;
}

export interface ParticipantListProps {
  participantList?: Array<Participant>;
  classes?: ParticipantListClasses;
}

const defaultClasses: ParticipantListClasses = {
  root:
    'flex flex-grow justify-content:center border-opacity-0 sm:hidden md:inline-block relative',
  buttonRoot:
    'text-gray-300 dark:text-gray-500 flex border-opacity-0 focus:outline-none w-60 py-1.5 bg-white',
  buttonOpen: 'rounded-t-xl dark:bg-gray-100 shadow-1 dark:shadow-none',
  buttonClosed: 'rounded-xl dark:bg-black',
  buttonInner: 'flex flex-grow justify-center px-3 m-0 my-1 tracking-wide self-center',  
  buttonText: 'pl-2 self-center',
  carat: 'w-3 h-3',
// TODO fix shadow border
  menuRoot:
  'w-60 max-h-116 pb-2 overflow-y-auto rounded-b-xl bg-white shadow-1 dark:shadow-none dark:bg-gray-100 focus:outline-none z-50 absolute',
  menuSection:
  'text-gray-200 dark:text-gray-500 group flex items-center px-3 pt-3 pb-2 text-base',
  menuItem:
    'text-gray-100 dark:text-white group flex items-center flex-nowrap px-3 py-2 text-base hover:bg-gray-600 dark:hover:bg-gray-200',
  menuText: 'w-52 whitespace-nowrap overflow-hidden overflow-ellipsis flex items-center',
  menuIconContainer: 'flex flex-grow justify-self-end justify-end',
};

const customClasses:ParticipantListClasses = {
  menuRoot:'hmsui-participantList-scrollbar'
}

type RoleMap = Map<string, Participant[]>;

export const ParticipantList = ({
  participantList,
  classes,
}: ParticipantListProps) => {
  const hu = useCallback(
    hmsUiClassParserGenerator<ParticipantListClasses>({
      classes,
      customClasses,
      defaultClasses,
      tag: 'hmsui-participantList',
    }),
    [],
  );
  const [listOpen, setListOpen] = useState(false);
  const handleClick = useCallback(() => setListOpen(open => !open), []);
  const rolesMap = groupBy(
    participantList,
    participant => participant.peer.role,
  );
  const roles = (Object.keys(rolesMap) as unknown) as keyof RoleMap[];

  return (
    <div className={`${hu('root')}`}>
      <button
        type="button"
        className={`${hu('buttonRoot')}
          ${
            listOpen
              ? hu('buttonOpen')
              : hu('buttonClosed')
          }`}
        onClick={handleClick}
      >
        <div className={`${hu('buttonInner')}`}>
          {participantList?.length} in room
          <span className={`${hu('buttonText')}`}>
            {listOpen ? (
              <UpCaratIcon className={hu('carat')} />
            ) : (
              <DownCaratIcon className={hu('carat')} />
            )}
          </span>
        </div>
      </button>
      {listOpen && (
        <div
          className={`${hu('menuRoot')}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          {roles &&
            //@ts-expect-error
            roles.map((role, index) => (
              <div key={index}>
                <div>
                  <span
                    className={`${hu('menuSection')}`}
                    role="menuitem"
                  >
                    {role === 'undefined' ? 'Unknown' : role}
                    {rolesMap[role].length > 1 ? 's' : ''}{' '}
                    {rolesMap[role].length}
                  </span>
                </div>
                <div>
                  {rolesMap[role] &&
                    rolesMap[role].map((participant, index) => (
                      <span
                        className={`${hu('menuItem')}`}
                        role="menuitem"
                        key={index}
                      >
                        <div className={`${hu('menuText')}`}>
                        <Avatar
                          label={participant.peer.displayName}
                          shape="square"
                          classes={{root:"mr-2"}}
                        />
                          {participant.peer.displayName}
                        </div>
                        <div
                          className={`${hu('menuIconContainer')}`}
                        >
                          <Button
                            iconOnly
                            shape={'circle'}
                            size={'sm'}
                            active={participant.isAudioMuted}
                          >
                            {participant.isAudioMuted ? (
                              <MicOffIcon />
                            ) : (
                              <MicOnIcon />
                            )}
                          </Button>
                        </div>
                      </span>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};