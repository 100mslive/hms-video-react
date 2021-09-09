import React, { Fragment, useMemo } from 'react';
import {
  HMSPlaylistActionType,
  HMSPlaylistType,
  selectPlaylistCurrentSelection,
  selectPlaylistProgress,
} from '@100mslive/hms-video-store';
import { NextIcon, PauseIcon, PlayIcon, PrevIcon } from '../Icons';
import { Button } from '../Button';
import { Slider } from '../Slider/Slider';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface PlaylistControlsClasses {
  root?: string;
  controls?: string;
  icon?: string;
  sliderContainer?: string;
}

export interface PlaylistControlsProps {
  classes?: PlaylistControlsClasses;
  type?: HMSPlaylistType;
}

interface PlaylistProgressProps {
  styler: (s: keyof PlaylistControlsClasses) => string | undefined;
  type: HMSPlaylistType;
}

const defaultClasses: PlaylistControlsClasses = {
  root: 'h-16 flex flex-col',
  controls: 'px-3 flex justify-center items-center',
  icon: 'w-full h-full',
  sliderContainer: 'px-3',
};

const PlaylistProgress = ({ styler, type }: PlaylistProgressProps) => {
  const progress = useHMSStore(selectPlaylistProgress(type));
  return (
    <div className={styler('sliderContainer')}>
      <Slider value={progress} onChange={() => {}} min={0} max={100} disabled />
    </div>
  );
};

export const PlaylistControls = ({
  classes,
  type = HMSPlaylistType.audio,
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
      <PlaylistProgress type={type} styler={styler} />
    </div>
  );
};
