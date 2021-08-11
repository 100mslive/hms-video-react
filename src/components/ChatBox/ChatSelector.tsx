import React, { useMemo, useState } from 'react';
import {
  selectAvailableRoleNames,
  selectRemotePeers,
} from '@100mslive/hms-video-store';
import { useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { Input } from '../Input';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface ChatSelectorClasses {
  root?: string;
  divider?: string;
  item?: string;
  dot?: string;
  itemTitle?: string;
  search?: string;
  searchBox?: string;
}

export interface ChatSelectorProps {
  show?: boolean;
  selection?: string;
  classes?: ChatSelectorClasses;
}

const defaultClasses: ChatSelectorClasses = {
  root: 'absolute w-full h-4/5 top-0 left-0 bg-white dark:bg-gray-200',
  divider: 'bg-gray-600 dark:bg-gray-200 h-px w-full my-4',
  item:
    'w-full h-8 flex flex-row items-center px-3 my-1 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  itemTitle: 'text-gray-100 dark:text-white text-base w-9/12 min-w-0 truncate',
  dot: 'bg-brand-main w-4 h-4 rounded-full',
  searchBox: 'p-3',
  search: 'h-8 bg-gray-600 dark:bg-gray-300',
};

export const ChatSelector = ({
  show = false,
  selection,
  classes,
}: ChatSelectorProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<ChatSelectorClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-chatSelector',
      }),
    [],
  );
  const roles = useHMSStore(selectAvailableRoleNames);
  const peers = useHMSStore(selectRemotePeers);
  const [search, setSearch] = useState('');

  if (!show) {
    return null;
  }

  return (
    <div className={styler('root')}>
      <div className={styler('searchBox')}>
        <Input
          autoCorrect="off"
          autoComplete="name"
          compact
          placeholder="Search Participants"
          classes={{ rootCompact: styler('search') }}
          onChange={e => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className={styler('item')}>
        <span className={styler('itemTitle')}>Everyone</span>
        {!selection && <span className={styler('dot')} />}
      </div>
      {roles.map(role => {
        return (
          <div className={styler('item')}>
            <span className={styler('itemTitle')}>{role}</span>
            {selection === 'role' && <span className={styler('dot')} />}
          </div>
        );
      })}
      <div className={styler('divider')}></div>
      {peers.map(peer => {
        return (
          <div className={styler('item')}>
            <span className={styler('itemTitle')}>{peer}</span>
            {selection === 'peer' && <span className={styler('dot')} />}
          </div>
        );
      })}
    </div>
  );
};
