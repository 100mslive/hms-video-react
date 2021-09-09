import React, { useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { PlaylistControls } from './PlaylistControls';

export interface VideoPlayerClasses {
  root?: string;
}

export interface VideoPlayerProps {
  classes?: VideoPlayerClasses;
}

const defaultClasses: VideoPlayerClasses = {
  root: 'relative',
};

export const VideoPlayer = ({ classes }: VideoPlayerProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<VideoPlayerClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-playlistcontrols',
      }),
    [classes],
  );

  return (
    <div className={styler('root')}>
      <video />
      <PlaylistControls />
    </div>
  );
};
