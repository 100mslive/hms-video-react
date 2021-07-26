import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
  ChangeEventHandler,
} from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { CloseIcon, DownCaratIcon, SettingsIcon, UpCaratIcon } from '../Icons';
import { ParticipantInList } from './ParticipantInList';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import groupBy from 'lodash/groupBy';
import './index.css';
import ClickAwayListener from 'react-click-away-listener';
import {
  HMSPeerWithMuteStatus,
  selectPeersWithAudioStatus,
  HMSPeer,
  selectLocalPeerRole,
} from '@100mslive/hms-video-store';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import {
  ParticipantListClasses,
  ParticipantListProps,
} from './ParticipantProps';
import { Dialog, withStyles } from '@material-ui/core';
import { Text } from '../Text';
import {
  selectAvailableRoleNames,
  selectAvailableRoles,
} from '@100mslive/hms-video-store';
import { Button } from '../Button';

const defaultClasses: ParticipantListClasses = {
  root: 'flex flex-grow border-opacity-0 sm:hidden md:inline-block relative',
  buttonRoot:
    'text-gray-300 dark:text-gray-500 flex border-opacity-0 focus:outline-none w-52 md:w-60 py-1.5 bg-white',
  buttonOpen: 'rounded-t-xl dark:bg-gray-100 shadow-1 dark:shadow-none',
  buttonClosed: 'rounded-xl dark:bg-black',
  buttonInner:
    'flex flex-grow justify-end md:justify-center px-3 m-0 my-1 tracking-wide self-center',
  buttonText: 'pl-2 self-center',
  carat: 'w-3 h-3',
  // TODO fix shadow border
  menuRoot:
    'w-52 md:w-60 max-h-116 pb-2 overflow-y-auto rounded-b-xl bg-white shadow-1 dark:shadow-none dark:bg-gray-100 focus:outline-none z-50 absolute',
  menuSection:
    'text-gray-200 dark:text-gray-500 group flex items-center px-3 pt-3 pb-2 text-base',
  menuItem:
    'text-gray-100 dark:text-white group flex items-center flex-nowrap px-3 py-2 text-base hover:bg-gray-600 dark:hover:bg-gray-200',
  menuText: 'flex-1 flex items-center',
  menuIconContainer: 'flex flex-shrink-0 justify-self-end justify-end',
  onIcon: '',
  offIcon: '',
  dialogContainer:
    'bg-white text-gray-100 dark:bg-gray-100 dark:text-white w-full p-4 rounded-xl',
  dialogHeader: 'flex items-center space-x-2',
  expanded: 'flex-grow',
  textGray: 'text-gray-400',
  divider: 'bg-gray-600 dark:bg-gray-200 h-px w-full my-4',
  formContainer: 'flex space-x-2 items-center justify-center px-4 py-2',
  selectContainer: 'rounded-lg bg-gray-600 dark:bg-gray-200 p-2 mx-2',
  select:
    'rounded-lg w-full h-full bg-gray-600 dark:bg-gray-200 focus:outline-none',
  dialogFooter: 'flex justify-end',
};

const customClasses: ParticipantListClasses = {
  menuRoot: 'hmsui-participantList-scrollbar',
  onIcon: 'hmsui-participantList-show-on-group-hover',
};

type RoleMap = Map<string, HMSPeerWithMuteStatus[]>;

const HMSDialog = withStyles({
  paper: {
    borderRadius: '12px',
    backgroundColor: 'inherit',
    minWidth: '400px',
  },
})(Dialog);

export const ParticipantList = ({
  participantList,
  classes,
  onToggle,
}: ParticipantListProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ParticipantListClasses>({
        tw,
        classes,
        customClasses,
        defaultClasses,
        tag: 'hmsui-participantList',
      }),
    [],
  );
  const participantsFromStore = useHMSStore(selectPeersWithAudioStatus);
  const [listOpen, setListOpen] = useState(false);
  participantList = participantList || participantsFromStore;
  const handleClick = useCallback(() => setListOpen(open => !open), []);
  const handleClose = useCallback(() => setListOpen(false), []);
  const rolesMap: Record<string, HMSPeerWithMuteStatus[]> = groupBy(
    participantList,
    participant => participant.peer.roleName,
  );
  const roles = Object.keys(rolesMap);
  const [selectedPeer, setSelectedPeer] = useState<HMSPeer | null>(null);
  const roleNames = useHMSStore(selectAvailableRoleNames);
  const hmsActions = useHMSActions();
  const localPeerRole = useHMSStore(selectLocalPeerRole);
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    if (onToggle) {
      onToggle(listOpen);
    }
  }, [listOpen]);

  const handleRoleChangeClose = () => {
    setSelectedPeer(null);
  };

  const handleInputChange: ChangeEventHandler<any> = event => {
    setSelectedRole(event.currentTarget.value);
  };

  const handleSaveSettings = () => {
    if (
      !selectedPeer ||
      !selectedRole ||
      !localPeerRole ||
      !localPeerRole.permissions.changeRole
    ) {
      return;
    }

    if (selectedPeer.roleName !== selectedRole) {
      hmsActions.changeRole(selectedPeer.id, selectedRole);
    }

    setSelectedPeer(null);
  };

  return (
    <>
      <HMSDialog
        open={!!selectedPeer}
        onClose={handleRoleChangeClose}
        aria-labelledby="Role change request"
        aria-describedby="Request user to change their role"
        maxWidth="sm"
      >
        <div className={styler('dialogContainer')}>
          <div className={styler('dialogHeader')}>
            <SettingsIcon className="h-7 w-7" />
            <div className={styler('expanded')}>
              <Text variant="heading">User Settings</Text>
            </div>
            <Button
              iconOnly
              variant="no-fill"
              iconSize="md"
              onClick={handleRoleChangeClose}
            >
              <CloseIcon className={styler('textGray')} />
            </Button>
          </div>

          <div className={styler('divider')}></div>

          <div className={styler('formContainer')}>
            <label htmlFor="role-change-select-menu">
              <Text variant="heading" size="sm">
                Role:
              </Text>
            </label>
            <div className={styler('selectContainer')}>
              <select
                id="role-change-select-menu"
                value={selectedRole}
                onChange={handleInputChange}
                className={styler('select')}
                disabled={
                  !localPeerRole || !localPeerRole.permissions.changeRole
                }
              >
                <option value="" className="p-4">
                  Select a new role
                </option>
                {roleNames.map(roleName => (
                  <option value={roleName} key={roleName}>
                    {roleName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styler('divider')}></div>

          <div className={styler('dialogFooter')}>
            <Button onClick={handleSaveSettings}>Confirm</Button>
          </div>
        </div>
      </HMSDialog>
      <ClickAwayListener onClickAway={handleClose}>
        <div className={`${styler('root')}`}>
          <button // button to open/close participant list
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
                roles.map(role => (
                  <div key={role}>
                    <span
                      className={`${styler('menuSection')}`}
                      role="menuitem"
                    >
                      {role === 'undefined' ? 'Unknown' : role}
                      {rolesMap[role].length > 1 ? 's' : ''}{' '}
                      {rolesMap[role].length}
                    </span>
                    <div>
                      {rolesMap[role] &&
                        rolesMap[role].map(participant => (
                          <ParticipantInList
                            key={participant.peer.id}
                            styler={styler}
                            isAudioEnabled={participant.isAudioEnabled}
                            name={participant.peer.name}
                            isLocal={participant.peer.isLocal}
                            onUserSettingsClick={() => {
                              setSelectedPeer(participant.peer);
                              setSelectedRole(participant.peer.roleName || '');
                            }}
                          />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </ClickAwayListener>
    </>
  );
};
