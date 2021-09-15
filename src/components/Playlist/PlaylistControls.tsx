import React, { useMemo } from 'react';
import {
  HMSPlaylistType,
  selectPlaylistCurrentSelection,
  selectPlaylistProgress,
  selectPlaylistSelection,
  selectPlaylistVolume,
} from '@100mslive/hms-video-store';
import {
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  VideoExitFullScreenIcon,
  VideoFullScreenIcon,
  VolumeIcon,
} from '../Icons';
import { Button } from '../Button';
import { Slider } from '../Slider/Slider';
import { VideoPlaylist } from './VideoPlaylist';
import { Text } from '../Text';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { formatDuration } from '../../utils/timerUtils';

export interface PlaylistControlsClasses {
  root?: string;
  controlsContainer?: string;
  controls?: string;
  icon?: string;
  progress?: string;
  sliderContainer?: string;
  rightControls?: string;
  volumeControl?: string;
  volumeControlIcon?: string;
}

export interface PlaylistControlsProps {
  classes?: PlaylistControlsClasses;
  type?: HMSPlaylistType;
  toggleFullScreen?: () => void;
  isFullScreen?: boolean;
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
  volumeControl: 'flex items-center w-24 pl-2',
  volumeControlIcon: 'mr-2 fill-current text-gray-100 dark:text-white',
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
        <Text variant="body" size="sm" classes={{ root: 'mb-2' }}>
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
        <Text variant="body" size="sm" classes={{ root: 'mb-2' }}>
          {formatDuration(duration)}
        </Text>
      )}
    </div>
  );
};

const VolumeControl = ({
  styler,
  type,
}: Omit<PlaylistProgressProps, 'duration'>) => {
  const hmsActions = useHMSActions();
  const volume = useHMSStore(selectPlaylistVolume(type));
  return (
    <div className={styler('volumeControl')}>
      <VolumeIcon className={styler('volumeControlIcon')} />
      <Slider
        value={volume}
        // @ts-ignore
        onChange={(event: any, value: number | number[]) => {
          if (typeof value === 'number') {
            hmsActions.playlist.setVolume({ volume: value, type });
          }
        }}
        min={0}
        max={100}
        noThumb
      />
    </div>
  );
};

export const PlaylistControls = ({
  classes,
  type = HMSPlaylistType.audio,
  toggleFullScreen = () => {},
  isFullScreen = false,
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
  const selection = useHMSStore(selectPlaylistSelection(type));
  const active = useHMSStore(selectPlaylistCurrentSelection(type));

  if (!active) {
    return null;
  }

  return (
    <div className={styler('root')}>
      <div className={styler('controlsContainer')}>
        {type === 'video' && <VolumeControl styler={styler} type={type} />}
        <div className={styler('controls')}>
          <Button
            key="previous"
            iconOnly
            variant="no-fill"
            iconSize="md"
            shape="rectangle"
            disabled={!selection.hasPrevious}
            onClick={async () => {
              await hmsActions.playlist.playPrevious({ type });
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
              if (active.playing) {
                await hmsActions.playlist.pause({ type, url: active.url });
              } else {
                await hmsActions.playlist.play({ type, url: active.url });
              }
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
            disabled={!selection.hasNext}
            onClick={async () => {
              await hmsActions.playlist.playNext({ type });
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
              {isFullScreen ? (
                <VideoExitFullScreenIcon />
              ) : (
                <VideoFullScreenIcon />
              )}
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
