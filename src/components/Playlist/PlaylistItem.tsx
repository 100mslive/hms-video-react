import React, { useMemo } from 'react';
import { HMSPlaylistItem } from '@100mslive/hms-video-store';
import { Text } from '../Text';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { formatDuration } from '../../utils/timerUtils';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface PlaylistItemClasses {
  root?: string;
  titleContainer?: string;
  truncate?: string;
  selection?: string;
  subtitle?: string;
}

const defaultClasses = {
  root:
    'flex justify-between items-center w-full px-3 py-3 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  titleContainer: 'flex flex-col flex-1',
  truncate: 'min-w-0 truncate',
  subtitle: 'text-gray-500 dark:text-gray-500',
  selection: 'text-brand-main',
};

export interface PlaylistItemProps {
  item: HMSPlaylistItem;
  onClick?: () => void;
  iconRight?: JSX.Element;
  classes?: PlaylistItemClasses;
  highlightSelection?: boolean;
}

export const PlaylistItem = ({
  item,
  classes,
  onClick,
  iconRight,
  highlightSelection = true,
}: PlaylistItemProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<PlaylistItemClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-playlistitem',
      }),
    [classes],
  );

  return (
    <div className={styler('root')} onClick={onClick}>
      <div className={styler('titleContainer')}>
        <Text
          variant="body"
          size="md"
          classes={{
            rootBodyMd: `${styler('truncate')} ${
              item.selected && highlightSelection ? styler('selection') : ''
            }`,
          }}
        >
          {item.name}
        </Text>
        <Text
          variant="body"
          size="sm"
          classes={{ rootBodySm: `${styler('truncate')}${styler('subtitle')}` }}
        >
          {item.metadata?.description}
        </Text>
      </div>
      {iconRight ? (
        iconRight
      ) : (
        <Text
          variant="body"
          size="sm"
          classes={{ rootBodySm: styler('subtitle') }}
        >
          {formatDuration(item.duration)}
        </Text>
      )}
    </div>
  );
};
