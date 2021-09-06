import React, { useMemo, useState } from 'react';
import { HMSPlaylistItem } from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { AudioPlaylistIcon, CloseIcon, PlaylistIcon } from '../Icons';
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
}

export interface AudioPlaylistItemClasses {
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
  header: 'flex justify-between items-center px-3 py-3',
  body: 'flex-1 overflow-y-auto bg-gray-100',
  footer: 'py-2',
  listItem:
    'flex justify-between w-full px-3 py-3 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  titleContainer: 'flex flex-column flex-1',
  truncate: 'min-w-0 truncate',
};

const defaultAudioList = [
  {
    name: 'Audio1',
    url: 'https://storage.googleapis.com/test-86284.appspot.com/audio1.mp3',
    type: 'audio',
  } as HMSPlaylistItem,
  {
    name: 'Audio2',
    url: 'https://storage.googleapis.com/test-86284.appspot.com/audio2.mp3',
    type: 'audio',
  } as HMSPlaylistItem,
  {
    name: 'Audio3',
    url: 'https://storage.googleapis.com/test-86284.appspot.com/audio3.mp3',
    type: 'audio',
  } as HMSPlaylistItem,
  {
    name: 'Audio4',
    url: 'https://storage.googleapis.com/test-86284.appspot.com/audio4.mp3',
    type: 'audio',
  } as HMSPlaylistItem,
];

export interface AudioPlaylistItemProps {
  item: HMSPlaylistItem;
  onClick?: () => void;
  iconRight?: JSX.Element;
  classes?: AudioPlaylistItemClasses;
}

const ListItem = ({
  item,
  classes,
  onClick,
  iconRight,
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
        <Text variant="body" size="md" className={styler('truncate')}>
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
          {/** @ts-ignore */}
          {item.duration}
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
  const [open, setOpen] = useState(false);
  const [collapse, setCollapse] = useState(true);
  const [active, setActive] = useState<HMSPlaylistItem>(defaultAudioList[0]);

  return (
    <ContextMenu
      classes={{
        trigger: 'bg-transparent-0 mx-2',
        root: 'static',
        menu: 'mt-0 py-0 w-52',
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
          {!collapse && (
            <div
              className={`${styler('body')} ${
                collapse ? styler('collapse') : ''
              }`}
            >
              {defaultAudioList.map(item => {
                return (
                  <ListItem
                    key={item.url}
                    item={item}
                    onClick={() => {
                      setActive(item);
                    }}
                  />
                );
              })}
            </div>
          )}
          <div className={styler('footer')}>
            <ListItem
              key={active.url}
              item={active}
              classes={{
                listItem: 'hover:bg-transparent-0 dark:hover:bg-transparent-0',
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
        </div>
      </ContextMenuItem>
    </ContextMenu>
  );
};
