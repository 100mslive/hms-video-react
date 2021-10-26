import React, { useMemo, useState } from 'react';
import { selectVideoPlaylist } from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { CloseIcon, PlaylistIcon } from '../Icons';
import { Text } from '../Text';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { Button } from '../Button';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';
import { PlaylistItem } from './PlaylistItem';

export interface VideoPlaylistClasses {
  root?: string;
  header?: string;
  body?: string;
  footer?: string;
  collapse?: string;
  controls?: string;
  icon?: string;
  sliderContainer?: string;
}

export interface VideoPlaylistItemClasses {
  listItem?: string;
  titleContainer?: string;
  truncate?: string;
  selection?: string;
}

export interface VideoPlaylistProps {
  classes?: VideoPlaylistClasses;
  trigger?: JSX.Element;
  active?: boolean;
}

const defaultClasses = {
  root: 'flex flex-column text-gray-100 dark:text-white',
  header: 'flex justify-between items-center px-3 py-3',
  body: 'flex-1 overflow-y-auto bg-gray-100',
  collapse: 'h-0',
  footer: 'py-2',
  titleContainer: 'flex flex-column flex-1',
  truncate: 'min-w-0 truncate',
  selection: 'text-brand-main',
};

export const VideoPlaylist = ({
  classes,
  trigger,
  active,
}: VideoPlaylistProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<VideoPlaylistClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-audioplaylist',
      }),
    [],
  );
  const hmsActions = useHMSActions();
  const playlist = useHMSStore(selectVideoPlaylist.list);
  const [open, setOpen] = useState(false);

  return (
    <ContextMenu
      classes={{
        trigger: 'bg-transparent-0',
        root: 'static',
        menu: 'mt-0 py-0 w-60',
        menuItem: 'hover:bg-transparent-0 dark:hover:bg-transparent-0',
      }}
      trigger={
        <Button
          key="audioPlaylist"
          iconOnly
          variant="no-fill"
          iconSize="md"
          shape="rectangle"
          active={active || open}
        >
          {trigger || <PlaylistIcon onClick={() => setOpen(value => !value)} />}
        </Button>
      }
      onTrigger={value => {
        setOpen(value);
      }}
      menuProps={{
        anchorOrigin: {
          vertical: 'top',
          horizontal: -48,
        },
        transformOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      }}
      menuOpen={open}
      noGutters
    >
      <ContextMenuItem
        label="Playlist"
        key="playlist"
        classes={{
          menuTitleContainer: 'hidden',
          menuItemChildren: 'w-full overflow-hidden mx-0 my-0',
        }}
        closeMenuOnClick={false}
      >
        <div className={styler('root')}>
          <div className={styler('header')}>
            <Text variant="heading" size="sm">
              Playlist
            </Text>
            <Button
              key="audioPlaylist"
              iconOnly
              variant="no-fill"
              iconSize="md"
              shape="rectangle"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon />
            </Button>
          </div>
          <div className={styler('body')}>
            {playlist.map(item => {
              return (
                <PlaylistItem
                  key={item.url}
                  item={item}
                  onClick={async () => {
                    await hmsActions.videoPlaylist.play(item.id);
                    setOpen(false);
                  }}
                />
              );
            })}
          </div>
        </div>
      </ContextMenuItem>
    </ContextMenu>
  );
};
