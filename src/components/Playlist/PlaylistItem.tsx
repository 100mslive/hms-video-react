import React, { useMemo } from 'react';
import { HMSPlaylistItem } from '@100mslive/hms-video-store';
import { Text } from '../Text';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { formatDuration } from '../../utils/timerUtils';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface PlaylistItemClasses {
  root?: string;
  titleContainer?: string;
}

const defaultClasses = {
  root:
    'flex justify-between items-center w-full px-3 py-3 hover:bg-gray-600 dark:hover:bg-gray-300 cursor-pointer',
  titleContainer: 'flex flex-col flex-1',
};

export interface PlaylistItemProps {
  item: HMSPlaylistItem<any>;
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
    [],
  );

  return (
    <div className={styler('root')} onClick={onClick}>
      <div className={styler('titleContainer')}>
        <Text
          variant="body"
          size="md"
          classes={{
            rootBodyMd: `truncate ${
              item.selected && highlightSelection ? 'text-brand-main' : ''
            }`,
          }}
        >
          {item.name}
        </Text>
        <Text
          variant="body"
          size="sm"
          classes={{ rootBodySm: 'text-gray-500 dark:text-gray-500' }}
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
          classes={{ rootBodySm: 'text-gray-500 dark:text-gray-500' }}
        >
          {formatDuration(item.duration)}
        </Text>
      )}
    </div>
  );
};
