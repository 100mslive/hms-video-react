import React, { useMemo, useState } from 'react';
import { HMSPlaylistItem } from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { AudioPlaylistIcon, CloseIcon } from '../Icons';
import { Text } from '../Text';
import { useHMSActions } from '../../hooks/HMSRoomProvider';
import { Button } from '../Button';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';

export interface AudioPlaylistClasses {
  root?: string;
  header?: string;
  body?: string;
  footer?: string;
  collapse?: string;
  listItem?: string;
  titleContainer?: string;
  truncate?: string;
}

export interface AudioPlaylistProps {
  classes: AudioPlaylistClasses;
  onClose: () => void;
}

const defaultClasses = {
  root: 'flex flex-column text-gray-100 dark:text-white',
  header: 'flex justify-between items-center h-9',
  body: 'transition-all h-40 overflow-y-auto bg-gray-100',
  collapse: 'h-0',
  listItem: 'flex justify-between w-full',
  titleContainer: 'flex flex-column flex-1',
  truncate: 'min-w-0 truncate',
};

export const AudioPlaylist = ({ classes }: AudioPlaylistProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<AudioPlaylistClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-contextmenu',
      }),
    [classes],
  );
  const hmsActions = useHMSActions();
  const list: HMSPlaylistItem[] = hmsActions.getPlaylist();
  const [open, setOpen] = useState(false);
  const [collapse, setCollapse] = useState(true);

  return (
    <ContextMenu
      classes={{
        trigger: 'w-auto h-auto bg-transparent-0',
        root: 'static',
        menu: 'bg-white dark:bg-gray-100',
        menuItem: 'hover:bg-transparent-0 dark:hover:bg-transparent-0',
      }}
      trigger={
        <Button
          key="audioPlaylist"
          iconOnly
          variant="no-fill"
          iconSize="md"
          shape="rectangle"
          classes={{ root: 'mx-2' }}
        >
          <AudioPlaylistIcon onClick={() => setOpen(value => !value)} />
        </Button>
      }
      onTrigger={value => {
        setOpen(value);
      }}
      menuProps={{
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
        transformOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      }}
      menuOpen={open}
    >
      <ContextMenuItem
        label="Playlist"
        key="playlist"
        classes={{
          menuTitleContainer: 'hidden',
          menuItemChildren: 'my-1 w-full overflow-hidden',
        }}
      >
        <div className={styler('root')}>
          <div className={styler('header')}>
            <Text variant="heading" size="sm">
              Audio Player
            </Text>
            <CloseIcon
              onClick={() => {
                setOpen(false);
              }}
            />
          </div>
          <div
            className={`${styler('body')} ${
              collapse ? styler('collapse') : ''
            }`}
          >
            {list.map(item => {
              return (
                <div className={styler('listItem')}>
                  <div className={styler('titleContainer')}>
                    <Text
                      variant="body"
                      size="md"
                      className={styler('truncate')}
                    >
                      {item.name}
                    </Text>
                    <Text
                      variant="body"
                      size="sm"
                      className={styler('truncate')}
                    >
                      {item.description}
                    </Text>
                  </div>
                  <Text variant="body" size="sm">
                    {/** @ts-ignore */}
                    {item.duration}
                  </Text>
                </div>
              );
            })}
          </div>
          <div className={styler('footer')}></div>
        </div>
      </ContextMenuItem>
    </ContextMenu>
  );
};
