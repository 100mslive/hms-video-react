import React, { useMemo, useState } from 'react';
import {
  HMSPlaylistItem,
  HMSPlaylistActionType,
  selectPlaylist,
  selectPlaylistCurrentSelection,
} from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import {
  AudioPlaylistIcon,
  CloseIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  PlaylistIcon,
  RewindIcon,
} from '../Icons';
import { Text } from '../Text';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { Button } from '../Button';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';
import { Slider } from '../Slider/Slider';
import { formatDuration } from '../../utils/timerUtils';

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

export interface AudioPlaylistItemClasses {
  listItem?: string;
  titleContainer?: string;
  truncate?: string;
  selection?: string;
}

export interface AudioPlaylistProps {
  classes: AudioPlaylistClasses;
  onClose: () => void;
}

const defaultClasses = {
  root: 'flex flex-column text-gray-100 dark:text-white',
  header: 'flex justify-between items-center px-3 py-3',
  body: 'flex-1 overflow-y-auto bg-gray-100',
  collapse: 'h-0',
  footer: 'py-2',
  listItem:
    'flex justify-between w-full px-3 py-3 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  titleContainer: 'flex flex-column flex-1',
  truncate: 'min-w-0 truncate',
  selection: 'text-brand-main',
  controls: 'px-3 flex justify-center items-center',
  icon: 'w-full h-full',
  sliderContainer: 'px-3',
};
export interface AudioPlaylistItemProps {
  item: HMSPlaylistItem;
  onClick?: () => void;
  iconRight?: JSX.Element;
  classes?: AudioPlaylistItemClasses;
  highlightSelection?: boolean;
}

const ListItem = ({
  item,
  classes,
  onClick,
  iconRight,
  highlightSelection = true,
}: AudioPlaylistItemProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<AudioPlaylistItemClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-audioplaylist',
      }),
    [classes],
  );
  return (
    <div className={styler('listItem')} onClick={onClick}>
      <div className={styler('titleContainer')}>
        <Text
          variant="body"
          size="md"
          className={`${styler('truncate')} ${
            item.selected && highlightSelection ? styler('selection') : ''
          }`}
        >
          {item.name}
        </Text>
        <Text variant="body" size="sm" className={styler('truncate')}>
          {item.description}
        </Text>
      </div>
      {iconRight ? (
        iconRight
      ) : (
        <Text variant="body" size="sm">
          {formatDuration(item.duration)}
        </Text>
      )}
    </div>
  );
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
    [classes],
  );
  const hmsActions = useHMSActions();
  const playlist = useHMSStore(selectPlaylist);
  const active = useHMSStore(selectPlaylistCurrentSelection);
  const [open, setOpen] = useState(false);
  const [collapse, setCollapse] = useState(!!active);

  return (
    <ContextMenu
      classes={{
        trigger: 'bg-transparent-0 mx-2',
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
          active={open}
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
              onClick={() => {
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
                <ListItem
                  key={item.url}
                  item={item}
                  onClick={async () => {
                    await hmsActions.performActionOnPlaylist({
                      url: item.url,
                      type: HMSPlaylistActionType.PLAY,
                    });
                  }}
                />
              );
            })}
          </div>
          {active && (
            <div className={styler('footer')}>
              <div className={styler('controls')}>
                <Button
                  key="rewind"
                  iconOnly
                  variant="no-fill"
                  iconSize="md"
                  shape="rectangle"
                  onClick={async () => {
                    await hmsActions.performActionOnPlaylist({
                      type: HMSPlaylistActionType.SEEK,
                      seekValue: -10,
                    });
                  }}
                >
                  <RewindIcon />
                </Button>
                <Button
                  key="playpause"
                  iconOnly
                  variant="no-fill"
                  iconSize="xl"
                  size="xl"
                  shape="rectangle"
                  onClick={async () => {
                    await hmsActions.performActionOnPlaylist({
                      url: active.url,
                      type: active.playing
                        ? HMSPlaylistActionType.PAUSE
                        : HMSPlaylistActionType.PLAY,
                    });
                  }}
                >
                  {active.playing ? (
                    <PauseIcon className={styler('icon')} />
                  ) : (
                    <PlayIcon className={styler('icon')} />
                  )}
                </Button>
                <Button
                  key="forward"
                  iconOnly
                  variant="no-fill"
                  iconSize="md"
                  shape="rectangle"
                  onClick={async () => {
                    await hmsActions.performActionOnPlaylist({
                      type: HMSPlaylistActionType.SEEK,
                      seekValue: 10,
                    });
                  }}
                >
                  <ForwardIcon />
                </Button>
              </div>
              <div className={styler('sliderContainer')}>
                <Slider
                  value={active.progress || 0}
                  onChange={() => {}}
                  min={0}
                  max={100}
                  disabled
                />
              </div>
              <ListItem
                key={active.url}
                item={active}
                highlightSelection={false}
                classes={{
                  listItem:
                    'hover:bg-transparent-0 dark:hover:bg-transparent-0',
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
