import React, { useMemo, useState } from 'react';
import {
  HMSPlaylistType,
  selectAudioPlaylist,
} from '@100mslive/hms-video-store';
import { AudioPlaylistIcon, CloseIcon, PlaylistIcon } from '../Icons';
import { Text } from '../Text';
import { Button } from '../Button';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';
import { PlaylistControls } from './PlaylistControls';
import { PlaylistItem } from './PlaylistItem';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface AudioPlaylistClasses {
  root?: string;
  header?: string;
  body?: string;
  footer?: string;
  collapse?: string;
  controls?: string;
  icon?: string;
  sliderContainer?: string;
}

export interface AudioPlaylistProps {
  classes: AudioPlaylistClasses;
}

const defaultClasses = {
  root: 'flex flex-column text-gray-100 dark:text-white',
  header: 'flex justify-between items-center px-3 py-3',
  body: 'flex-1 overflow-y-auto bg-gray-100',
  collapse: 'h-0',
  footer: 'py-2',
};

export const AudioPlaylist = ({ classes }: AudioPlaylistProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<AudioPlaylistClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-audioplaylist',
      }),
    [],
  );
  const hmsActions = useHMSActions();
  const playlist = useHMSStore(selectAudioPlaylist.list);
  const active = useHMSStore(selectAudioPlaylist.selectedItem);
  const [open, setOpen] = useState(false);
  const [collapse, setCollapse] = useState(!!active);

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
          active={open || !!active}
        >
          <AudioPlaylistIcon
            key="audioPlaylistTriggerIcon"
            onClick={() => setOpen(value => !value)}
          />
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
              Audio Player
            </Text>
            <Button
              key="audioPlaylist"
              iconOnly
              variant="no-fill"
              iconSize="md"
              shape="rectangle"
              onClick={async () => {
                if (active) {
                  await hmsActions.audioPlaylist.stop();
                }
                setOpen(false);
              }}
            >
              <CloseIcon />
            </Button>
          </div>
          <div
            className={`${styler('body')} ${
              collapse ? styler('collapse') : ''
            }`}
          >
            {playlist.map(item => {
              return (
                <PlaylistItem
                  key={item.url}
                  item={item}
                  onClick={async () => {
                    await hmsActions.audioPlaylist.play(item.id);
                  }}
                />
              );
            })}
          </div>
          {active && (
            <div className={styler('footer')}>
              <PlaylistControls />
              <PlaylistItem
                key={active.url}
                item={active}
                highlightSelection={false}
                classes={{
                  root: 'hover:bg-transparent-0 dark:hover:bg-transparent-0',
                }}
                iconRight={
                  <Button
                    key="audioPlaylist"
                    iconOnly
                    variant="no-fill"
                    iconSize="md"
                    shape="rectangle"
                    onClick={() => {
                      setCollapse(value => !value);
                    }}
                  >
                    <PlaylistIcon />
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </ContextMenuItem>
    </ContextMenu>
  );
};
