import React, { useEffect, useState } from 'react';
// import { MuteListButton, SpotlightListButton } from '../MediaIcons';
import {
  DownCaratIcon,
  UpCaratIcon,
  MicOffIcon,
  MicOnIcon,
  StarFillIcon,
  StarIcon,
} from '../../icons';
import { Participant } from '../../types';
import { AvatarList } from '../Avatar';
import Popover from '@material-ui/core/Popover';
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';
import { Button } from '../Button';
import {groupBy} from 'lodash';

export interface ParticipantListClasses {
  root?: string;
  buttonRoot?: string;
  buttonOpen?: string;
  buttonClosed?: string;
  buttonInner?: string;
  buttonText?: string;
  menuRoot?: string;
  menuInner?: string;
  menuSection?: string;
  menuItem?: string;
  menuText?: string;
  menuIconContainer?: string;
}

interface StyledParticipantListProps {
  participantList: Array<Participant>;
  defaultClasses?: ParticipantListClasses;
  classes?: ParticipantListClasses;
}

const defaultClasses: ParticipantListClasses = {
  root:
    'flex flex-grow justify-content:center border-opacity-0 sm:hidden md:block',
  buttonRoot:
    'text-gray-300 dark:text-gray-500 flex border-opacity-0 focus:outline-none w-60 pt-1.5 mb-1 rounded-tl-lg rounded-tr-lg bg-white',
  buttonOpen: 'dark:bg-gray-100',
  buttonClosed: 'dark:bg-black',
  buttonInner: 'flex flex-grow justify-center px-3 tracking-wide self-center',
  buttonText: 'pl-2 self-center',
  menuRoot: 'max-h-100 rounded-bl-xl rounded-br-xl mt-6',
  menuInner:
    'w-60 max-h-100 overflow-y-auto rounded-bl-xl rounded-br-xl py-1.5 bg-white dark:bg-gray-100 focus:outline-none',
  menuSection:
    'text-gray-300 dark:text-gray-500 group flex items-center px-3 py-2 text-base',
  menuItem:
    'text-gray-100 dark:text-white group flex items-center space-x-2 px-3 py-2 text-base hover:bg-gray-600 dark:hover:bg-gray-200',
  menuText: 'flex justify-between',
  menuIconContainer: 'flex flex-grow justify-end absolute space-x-1',
};

type RoleMap = Map<string, Participant[]>;

export const StyledParticipantList = ({
  participantList,
  defaultClasses,
  classes: extraClasses,
}: StyledParticipantListProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [rolesMap, setRolesMap] = useState<RoleMap | {}>({});
  const [roles, setRoles] = useState<keyof RoleMap[] | []>([]);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  useEffect(()=>{
    const map = groupBy(participantList, participant => participant.peer.role);
    setRolesMap(map);
    setRoles(Object.keys(map) as unknown as keyof RoleMap[]);
  },[participantList])

  return (
    <div className={`${combinedClasses?.root}`}>
      <button
        aria-describedby={id}
        type="button"
        className={` ${combinedClasses?.buttonRoot}
          ${
            open ? combinedClasses?.buttonOpen : combinedClasses?.buttonClosed
          }`}
        onClick={handleClick}
      >
        <div className={`${combinedClasses?.buttonInner}`}>
          {participantList.length} in room
          <span className={`${combinedClasses?.buttonText}`}>
            {open ? (
              <UpCaratIcon className="w-3 h-3" />
            ) : (
              <DownCaratIcon className="w-3 h-3 " />
            )}
          </span>
        </div>
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        className={`${combinedClasses?.menuRoot}`}
        onClose={handleClick}
      >
        <div
          className={`${combinedClasses?.menuInner}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          {/* @ts-expect-error */}
          {roles && roles.map((role, index) => (
              <div key={index}>
                <div>
                  <span
                    className={`${combinedClasses?.menuSection}`}
                    role="menuitem"
                    >
                    {/* @ts-expect-error */}
                    {role} {rolesMap[role].length}
                  </span>
                 </div>
                <div>
                  {/* @ts-expect-error */}
                {rolesMap[role] && rolesMap[role].map(
                  // @ts-expect-error
                  (participant, index) => (
                  <a
                    className={`${combinedClasses?.menuItem}`}
                    role="menuitem"
                    key={index}
                  >
                    <AvatarList label={participant.peer.displayName} />
                    <div className={`${combinedClasses?.menuItem}`}>
                      {participant.peer.displayName}
                    </div>
                    <div className={`${combinedClasses?.menuIconContainer}`}>
                      <Button
                        variant={'icon-only'}
                        shape={'circle'}
                        size={'sm'}
                        classes={{
                          iconOnlySm: 'opacity-0 hover:opacity-100',
                          root: 'to-be-overridden',
                        }}
                        active={participant.isAudioMuted}
                      >
                        {participant.isAudioMuted ? (
                          <MicOffIcon />
                        ) : (
                          <MicOnIcon />
                        )}
                      </Button>
                      {/* <MuteListButton isMuteOn={participant.isAudioMuted} /> */}
                      <Button
                        variant={'icon-only'}
                        shape={'circle'}
                        size={'sm'}
                        classes={{
                          iconOnlySm: 'opacity-0 hover:opacity-100',
                        }}
                        active={participant.isStarMarked}
                      >
                        {participant.isStarMarked ? (
                          <StarIcon />
                        ) : (
                          <StarFillIcon />
                        )}
                      </Button>
                      {/* <SpotlightListButton
                        isSpotlightOn={participant.isStarMarked}
                      /> */}
                    </div>
                  </a>
                ))}
              </div>
            </div>
        )

          )}
        </div>
      </Popover>
    </div>
  );
};

export type ParticipantListProps = Omit<
  StyledParticipantListProps,
  'defaultClasses'
>;

//TODO replace with themeContext
export const ParticipantList = withClasses<ParticipantListClasses | undefined>(
  defaultClasses,
  'participantList',
)<StyledParticipantListProps>(StyledParticipantList);
