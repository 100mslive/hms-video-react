import React, { useMemo, useState } from 'react';
import {
  selectAvailableRoleNames,
  selectRemotePeers,
  HMSPeer,
  selectMessagesUnreadCountByRole,
  selectMessagesUnreadCountByPeerID,
  selectBroadcastMessagesUnreadCount,
} from '@100mslive/hms-video-store';
import { useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { Input } from '../Input';
import { Avatar } from '../TwAvatar';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface ChatSelectorClasses {
  root?: string;
  divider?: string;
  itemList?: string;
  item?: string;
  dot?: string;
  itemTitle?: string;
  search?: string;
  searchBox?: string;
  itemHover?: string;
}

export interface ChatSelectorProps {
  show?: boolean;
  selectedRole?: string;
  selectedPeerID?: string;
  classes?: ChatSelectorClasses;
  onChange: (change: { peer: string; role: string }) => void;
}

const defaultClasses: ChatSelectorClasses = {
  root:
    'absolute w-full top-14 left-0 bottom-16 bg-white dark:bg-gray-200 flex flex-col',
  divider: 'bg-gray-400 dark:bg-white h-px w-full my-2',
  itemList:
    'flex-1 pb-2 overflow-y-auto text-gray-100 dark:text-white text-base',
  item: 'w-full h-10 flex flex-row items-center pl-5 pr-3',
  itemHover: 'hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  itemTitle: 'flex-1 w-9/12 min-w-0 truncate',
  dot: 'bg-brand-main w-3 h-3 rounded-full',
  searchBox: 'p-3',
  search: 'h-8 bg-gray-600 dark:bg-gray-300',
};

interface ChatSelectorRoleProps {
  role: string;
  onChange: (change: { peer: string; role: string }) => void;
  styler: (s: keyof ChatSelectorClasses) => string | undefined;
}

interface ChatSelectorPeerProps {
  peer: HMSPeer;
  onChange: (change: { peer: string; role: string }) => void;
  styler: (s: keyof ChatSelectorClasses) => string | undefined;
}

const ChatSelectorRole = ({
  role,
  styler,
  onChange,
}: ChatSelectorRoleProps) => {
  const unreadCount = useHMSStore(selectMessagesUnreadCountByRole(role));
  return (
    <div
      className={`${styler('item')} ${styler('itemHover')}`}
      key={role}
      onClick={() => onChange({ role, peer: '' })}
    >
      <span className={styler('itemTitle')}>{role}</span>
      {unreadCount > 0 && <span className={styler('dot')} />}
    </div>
  );
};

const ChatSelectorPeer = ({
  peer,
  styler,
  onChange,
}: ChatSelectorPeerProps) => {
  const unreadCount = useHMSStore(selectMessagesUnreadCountByPeerID(peer.id));
  return (
    <div
      className={`${styler('item')} ${styler('itemHover')}`}
      key={peer.id}
      onClick={() => onChange({ peer: peer.id, role: '' })}
    >
      <Avatar
        label={peer.name}
        shape="square"
        size="sm"
        classes={{ root: 'mr-2' }}
      />
      <span className={styler('itemTitle')}>{peer.name}</span>
      {unreadCount > 0 && <span className={styler('dot')} />}
    </div>
  );
};

export const ChatSelector = ({
  show = false,
  classes,
  onChange,
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
  const unreadCount = useHMSStore(selectBroadcastMessagesUnreadCount);
  const [search, setSearch] = useState('');
  const filteredPeers = peers.filter(peer => {
    if (!search.replace(/\u200b/g, ' ')) {
      return true;
    }
    return peer.name.toLowerCase().includes(search.toLowerCase());
  });

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
      <div className={styler('itemList')}>
        <div
          className={`${styler('item')} ${styler('itemHover')}`}
          onClick={() => onChange({ role: '', peer: '' })}
        >
          <span className={styler('itemTitle')}>Everyone</span>
          {unreadCount > 0 && <span className={styler('dot')} />}
        </div>
        {roles.map(role => {
          return (
            <ChatSelectorRole role={role} onChange={onChange} styler={styler} />
          );
        })}
        {(filteredPeers.length > 0 || search) && (
          <div className={styler('divider')}></div>
        )}
        {search && filteredPeers.length === 0 && (
          <div className={styler('item')}>No Participants found</div>
        )}
        {filteredPeers.map(peer => {
          return (
            <ChatSelectorPeer peer={peer} onChange={onChange} styler={styler} />
          );
        })}
      </div>
    </div>
  );
};
