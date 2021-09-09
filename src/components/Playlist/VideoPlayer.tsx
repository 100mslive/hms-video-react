import React, { useMemo } from 'react';
import {
  HMSPeer,
  HMSPlaylistType,
  selectPlaylistVideoTrackByPeerID,
} from '@100mslive/hms-video-store';
import { PlaylistControls } from './PlaylistControls';
import { Video } from '../Video/Video';
import { useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface VideoPlayerClasses {
  root?: string;
  video?: string;
  controls?: string;
}

export interface VideoPlayerProps {
  classes?: VideoPlayerClasses;
  peer: HMSPeer;
}

const defaultClasses: VideoPlayerClasses = {
  root: 'relative w-full h-full',
};

export const VideoPlayer = ({ classes, peer }: VideoPlayerProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<VideoPlayerClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-videoplayer',
      }),
    [classes],
  );
  const videoTrack = useHMSStore(selectPlaylistVideoTrackByPeerID(peer.id));

  return (
    <div className={styler('root')}>
      <Video hmsVideoTrack={videoTrack} objectFit="cover" />
      <PlaylistControls
        classes={{ root: 'absolute left-0 bottom-3 w-full flex-col-reverse' }}
        type={HMSPlaylistType.video}
      />
    </div>
  );
};
