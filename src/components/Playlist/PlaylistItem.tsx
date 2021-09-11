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
}

const defaultClasses = {
  root:
    'flex justify-between items-center w-full px-3 py-3 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  titleContainer: 'flex flex-column flex-1',
  truncate: 'min-w-0 truncate',
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
