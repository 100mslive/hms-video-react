import React, { useMemo, useState, useCallback } from 'react';
import {useHMSTheme} from '../../hooks/HMSThemeProvider'
import { DownCaratIcon, UpCaratIcon } from '../Icons';
import {ParticipantInList} from './ParticipantInList';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { groupBy } from 'lodash';
import './index.css';
import ClickAwayListener from 'react-click-away-listener';
import { HMSPeerWithMuteStatus, selectPeersWithAudioStatus } from '../../store/selectors';
import { useHMSStore } from '../../hooks/HMSRoomProvider';
import { ParticipantListClasses } from './ParticipantProps';
import { ParticipantListProps } from '../../../dist';

const defaultClasses: ParticipantListClasses = {
  root:
    'flex flex-grow justify-content:center border-opacity-0 sm:hidden md:inline-block relative',
  buttonRoot:
    'text-gray-300 dark:text-gray-500 flex border-opacity-0 focus:outline-none w-60 py-1.5 bg-white',
  buttonOpen: 'rounded-t-xl dark:bg-gray-100 shadow-1 dark:shadow-none',
  buttonClosed: 'rounded-xl dark:bg-black',
  buttonInner:
    'flex flex-grow justify-center px-3 m-0 my-1 tracking-wide self-center',
  buttonText: 'pl-2 self-center',
  carat: 'w-3 h-3',
  // TODO fix shadow border
  menuRoot:
    'w-60 max-h-116 pb-2 overflow-y-auto rounded-b-xl bg-white shadow-1 dark:shadow-none dark:bg-gray-100 focus:outline-none z-50 absolute',
  menuSection:
    'text-gray-200 dark:text-gray-500 group flex items-center px-3 pt-3 pb-2 text-base',
  menuItem:
    'text-gray-100 dark:text-white group flex items-center flex-nowrap px-3 py-2 text-base hover:bg-gray-600 dark:hover:bg-gray-200',
  menuText:
    'w-52 whitespace-nowrap overflow-hidden overflow-ellipsis flex items-center',
  menuIconContainer: 'flex flex-grow justify-self-end justify-end',
  onIcon: '',
  offIcon: '',
};

const customClasses: ParticipantListClasses = {
  menuRoot: 'hmsui-participantList-scrollbar',
  onIcon: 'hmsui-participantList-show-on-group-hover',
};

type RoleMap = Map<string, HMSPeerWithMuteStatus[]>;

export const ParticipantList = ({
  participantList,
  classes,
}: ParticipantListProps) => {
  const {tw} = useHMSTheme();
  const styler = useMemo(()=>
    hmsUiClassParserGenerator<ParticipantListClasses>({
      tw,
      classes,
      customClasses,
      defaultClasses,
      tag: 'hmsui-participantList',
    }),[]);
  const participantsFromStore = useHMSStore(selectPeersWithAudioStatus);
  const [listOpen, setListOpen] = useState(false);
  participantList = participantList || participantsFromStore;
  const handleClick = useCallback(() => setListOpen(open => !open), []);
  const handleClose = useCallback(() => setListOpen(false), []);
  const rolesMap = groupBy(
    participantList,
    participant => participant.peer.role,
  );
  const roles = (Object.keys(rolesMap) as unknown) as keyof RoleMap[];

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div className={`${styler('root')}`}>
        <button  // button to open/close participant list
          type="button"
          className={`${styler('buttonRoot')}
          ${listOpen ? styler('buttonOpen') : styler('buttonClosed')}`}
          onClick={handleClick}
        >
          <div className={`${styler('buttonInner')}`}>
            {participantList?.length} in room
            <span className={`${styler('buttonText')}`}>
              {listOpen ? (
                <UpCaratIcon className={styler('carat')} />
              ) : (
                <DownCaratIcon className={styler('carat')} />
              )}
            </span>
          </div>
        </button>

        {listOpen && (
          <div
            className={`${styler('menuRoot')}`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            {roles &&
              //@ts-expect-error
              roles.map((role) => (
                <div key={role}>
                  <div>
                    <span className={`${styler('menuSection')}`} role="menuitem">
                      {role === 'undefined' ? 'Unknown' : role}
                      {rolesMap[role].length > 1 ? 's' : ''}{' '}
                      {rolesMap[role].length}
                    </span>
                  </div>
                  <div>
                    {rolesMap[role] &&
                      rolesMap[role].map((participant) => (
                        <ParticipantInList
                          key={participant.peer.id}
                          styler={styler}
                          isAudioEnabled={participant.isAudioEnabled}
                          name={participant.peer.name}
                        />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};
