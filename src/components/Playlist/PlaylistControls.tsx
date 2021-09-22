import React, { useMemo } from 'react';
import {
  HMSPlaylistType,
  selectAudioPlaylist,
  selectAudioTrackVolume,
  selectPeerSharingVideoPlaylist,
  selectVideoPlaylist,
  selectVideoPlaylistAudioTrackByPeerID,
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
  const selectPlaylist =
    type === HMSPlaylistType.audio ? selectAudioPlaylist : selectVideoPlaylist;
  const progress = useHMSStore(selectPlaylist.progress);
  const hmsActions = useHMSActions();
  const playlistAction =
    type === HMSPlaylistType.audio
      ? hmsActions.audioPlaylist
      : hmsActions.videoPlaylist;

  if (!duration) {
    return null;
  }

  return (
    <div className={styler('progress')}>
      {type === 'video' && (
        <Text variant="body" size="sm" classes={{ root: 'mb-2' }}>
          {formatDuration(progress * 0.01 * duration)}
        </Text>
      )}
      <div className={styler('sliderContainer')}>
        <Slider
          value={progress}
          onChange={() => {}}
          onChangeCommitted={(event: any, value: number | number[]) => {
            if (typeof value === 'number') {
              playlistAction.seekTo(value * 0.01 * duration);
            }
          }}
          min={0}
          max={100}
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
  const selectPlaylist =
    type === HMSPlaylistType.audio ? selectAudioPlaylist : selectVideoPlaylist;
  const volume = useHMSStore(selectPlaylist.volume);
  const active = useHMSStore(selectPlaylist.selectedItem);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const audioTrack = useHMSStore(
    selectVideoPlaylistAudioTrackByPeerID(peerSharingPlaylist?.id),
  );
  const audioTrackVolume = useHMSStore(selectAudioTrackVolume(audioTrack?.id));
  const sliderVolume = active ? volume : audioTrackVolume

  return (
    <div className={styler('volumeControl')}>
      <VolumeIcon className={styler('volumeControlIcon')} />
      <Slider
        value={sliderVolume || 100}
        // @ts-ignore
        onChange={(event: any, value: number | number[]) => {
          if (typeof value === 'number') {
            if (active) {
              hmsActions.videoPlaylist.setVolume(value);
            } else if (audioTrack) {
              hmsActions.setVolume(value, audioTrack.id);
            }
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
  const selectPlaylist =
    type === HMSPlaylistType.audio ? selectAudioPlaylist : selectVideoPlaylist;
  const selection = useHMSStore(selectPlaylist.selection);
  const active = useHMSStore(selectPlaylist.selectedItem);

  const playlist =
    type === HMSPlaylistType.audio
      ? hmsActions.audioPlaylist
      : hmsActions.videoPlaylist;

  return (
    <div className={styler('root')}>
      <div className={styler('controlsContainer')}>
        {type === 'video' && <VolumeControl styler={styler} type={type} />}
        {active && (
          <div className={styler('controls')}>
            <Button
              key="previous"
              iconOnly
              variant="no-fill"
              iconSize="md"
              shape="rectangle"
              disabled={!selection.hasPrevious}
              onClick={async () => {
                await playlist.playPrevious();
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
                  await playlist.pause(active.id);
                } else {
                  await playlist.play(active.id);
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
                await playlist.playNext();
              }}
            >
              <NextIcon />
            </Button>
          </div>
        )}
        {type === 'video' && (
          <div className={styler('rightControls')}>
            {active && <VideoPlaylist />}
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
      {active && (
        <PlaylistProgress
          type={type}
          styler={styler}
          duration={active.duration}
        />
      )}
    </div>
  );
};
