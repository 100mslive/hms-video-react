import React, { useCallback, useState } from 'react';
import {
  DownCaratIcon,
  UpCaratIcon,
  MicOffIcon,
  MicOnIcon,
  StarFillIcon,
  StarIcon,
} from '../Icons';
import { Participant } from '../../types';
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';
import { Button } from '../TwButton';
import { groupBy } from 'lodash';
import './ParticipantList.css';

const ParticipantAvatar = React.memo(
  ({ label = '', width = '20px' }: { label: string; width?: string }) => {
    return (
      <img
        src={`https://ui-avatars.com/api/?name=${label}&background=random&rounded=true&font-size=0.53`}
        alt={`${label}'s Avatar`}
        style={{ width, height: width }}
      />
    );
  },
);

export interface ParticipantListClasses {
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

interface StyledParticipantListProps {
  participantList?: Array<Participant>;
  defaultClasses?: ParticipantListClasses;
  classes?: ParticipantListClasses;
}

const defaultClasses: ParticipantListClasses = {
  root:
    'flex flex-grow justify-content:center border-opacity-0 sm:hidden md:inline-block relative',
  buttonRoot:
    'text-gray-300 dark:text-gray-500 flex border-opacity-0 focus:outline-none w-60 py-1.5 bg-white',
  buttonOpen: 'rounded-t-xl dark:bg-gray-100',
  buttonClosed: 'rounded-xl dark:bg-black',
  buttonInner: 'flex flex-grow justify-center px-3 m-0 my-1 tracking-wide self-center',
  buttonText: 'pl-2 self-center',
  carat: 'w-3 h-3',
  menuRoot:
    'w-60 max-h-116 pb-2 overflow-y-auto rounded-b-xl bg-white dark:bg-gray-100 focus:outline-none z-50 absolute',
  menuSection:
    'text-gray-200 dark:text-gray-500 group flex items-center px-3 pt-3 pb-2 text-base',
  menuItem:
    'text-gray-100 dark:text-white group flex items-center flex-nowrap px-3 py-2 text-base hover:bg-gray-600 dark:hover:bg-gray-200',
  menuText: 'w-52 mx-2 whitespace-nowrap overflow-hidden overflow-ellipsis',
  menuIconContainer: 'flex flex-grow justify-self-end justify-end',
};

type RoleMap = Map<string, Participant[]>;

export const StyledParticipantList = ({
  participantList,
  defaultClasses,
  classes: extraClasses,
}: StyledParticipantListProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [listOpen, setListOpen] = useState(false);
  const handleClick = useCallback(() => setListOpen(open => !open), []);
  const rolesMap = groupBy(
    participantList,
    participant => participant.peer.role,
  );
  const roles = (Object.keys(rolesMap) as unknown) as keyof RoleMap[];

  return (
    <div className={`${combinedClasses?.root}`}>
      <button
        type="button"
        className={`${combinedClasses?.buttonRoot}
          ${
            listOpen
              ? combinedClasses?.buttonOpen
              : combinedClasses?.buttonClosed
          }`}
        onClick={handleClick}
      >
        <div className={`${combinedClasses?.buttonInner}`}>
          {participantList?.length} in room
          <span className={`${combinedClasses?.buttonText}`}>
            {listOpen ? (
              <UpCaratIcon className={combinedClasses?.carat} />
            ) : (
              <DownCaratIcon className={combinedClasses?.carat} />
            )}
          </span>
        </div>
      </button>
      {listOpen && (
        <div
          id="HMSui-components-participant-list"
          className={`${combinedClasses?.menuRoot}`}
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
                    className={`${combinedClasses?.menuSection}`}
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
                        className={`${combinedClasses?.menuItem}`}
                        role="menuitem"
                        key={index}
                      >
                        <ParticipantAvatar
                          label={participant.peer.displayName}
                        />
                        <div className={`${combinedClasses?.menuText}`}>
                          {participant.peer.displayName}
                        </div>
                        <div
                          className={`${combinedClasses?.menuIconContainer}`}
                        >
                          <Button
                            iconOnly
                            shape={'circle'}
                            size={'sm'}
                            classes={{
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

export type ParticipantListProps = Omit<
  StyledParticipantListProps,
  'defaultClasses'
>;

export const ParticipantList = withClasses<ParticipantListClasses | undefined>(
  defaultClasses,
  'participantList',
)<StyledParticipantListProps>(StyledParticipantList);
