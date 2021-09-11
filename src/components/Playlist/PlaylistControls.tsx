import React, { useMemo } from 'react';
import {
  HMSPlaylistActionType,
  HMSPlaylistType,
  selectPlaylistCurrentSelection,
  selectPlaylistProgress,
} from '@100mslive/hms-video-store';
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  VideoFullScreenIcon,
} from '../Icons';
import { Button } from '../Button';
import { Slider } from '../Slider/Slider';
import { VideoPlaylist } from './VideoPlaylist';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { formatDuration } from '../../utils/timerUtils';
import { Text } from '../Text';

export interface PlaylistControlsClasses {
  root?: string;
  controlsContainer?: string;
  controls?: string;
  icon?: string;
  progress?: string;
  sliderContainer?: string;
  rightControls?: string;
}

export interface PlaylistControlsProps {
  classes?: PlaylistControlsClasses;
  type?: HMSPlaylistType;
  toggleFullScreen?: () => void;
}

interface PlaylistProgressProps {
  styler: (s: keyof PlaylistControlsClasses) => string | undefined;
  type: HMSPlaylistType;
  duration?: number;
}

const defaultClasses: PlaylistControlsClasses = {
  root: 'h-16 flex flex-col',
  controlsContainer: 'flex justify-between',
  controls: 'px-3 flex-1 flex justify-center items-center',
  icon: 'w-full h-full',
  progress: 'flex items-center px-2 text-gray-500',
  sliderContainer: 'px-3 flex-1',
  rightControls: 'flex items-center px-2',
};

const PlaylistProgress = ({
  styler,
  type,
  duration,
}: PlaylistProgressProps) => {
  const progress = useHMSStore(selectPlaylistProgress(type));
  return (
    <div className={styler('progress')}>
      {type === 'video' && duration && (
        <Text variant="body" size="sm" classes={{ root: 'mb-2'}}>
          {formatDuration(progress * 0.01 * duration)}
        </Text>
      )}
      <div className={styler('sliderContainer')}>
        <Slider
          value={progress}
          onChange={() => {}}
          min={0}
          max={100}
          disabled
        />
      </div>
      {type === 'video' && duration && (
        <Text variant="body" size="sm" classes={{ root: 'mb-2'}}>
          {formatDuration(duration)}
        </Text>
      )}
    </div>
  );
};

export const PlaylistControls = ({
  classes,
  type = HMSPlaylistType.audio,
  toggleFullScreen = () => {},
}: PlaylistControlsProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<PlaylistControlsClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-playlistcontrols',
      }),
    [classes],
  );
  const hmsActions = useHMSActions();
  const active = useHMSStore(selectPlaylistCurrentSelection(type));

  if (!active) {
    return null;
  }

  return (
    <div className={styler('root')}>
      <div className={styler('controlsContainer')}>
        <div className={styler('controls')}>
          <Button
            key="previous"
            iconOnly
            variant="no-fill"
            iconSize="md"
            shape="rectangle"
            onClick={async () => {
              await hmsActions.performActionOnPlaylist({
                actionType: HMSPlaylistActionType.PLAY_PREV,
                type,
              });
            }}
          >
            <PrevIcon />
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
                actionType: active.playing
                  ? HMSPlaylistActionType.PAUSE
                  : HMSPlaylistActionType.PLAY,
                type,
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
            key="next"
            iconOnly
            variant="no-fill"
            iconSize="md"
            shape="rectangle"
            onClick={async () => {
              await hmsActions.performActionOnPlaylist({
                actionType: HMSPlaylistActionType.PLAY_NEXT,
                type,
              });
            }}
          >
            <NextIcon />
          </Button>
        </div>
        {type === 'video' && (
          <div className={styler('rightControls')}>
            <VideoPlaylist />
            <Button
              key="fullscreen"
              iconOnly
              variant="no-fill"
              iconSize="md"
              shape="rectangle"
              classes={{ root: 'cursor-pointer' }}
              onClick={toggleFullScreen}
            >
              <VideoFullScreenIcon />
            </Button>
          </div>
        )}
      </div>
      <PlaylistProgress
        type={type}
        styler={styler}
        duration={active.duration}
      />
    </div>
  );
};
