import React, { useMemo } from 'react';
import {
  HMSPeer,
  HMSPlaylistType,
  selectPlaylistCurrentSelection,
  selectPlaylistVideoTrackByPeerID,
} from '@100mslive/hms-video-store';
import { PlaylistControls } from './PlaylistControls';
import { Video } from '../Video/Video';
import { useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Text } from '../Text';
import { Button } from '../Button';
import { CloseIcon } from '../Icons';

export interface VideoPlayerClasses {
  root?: string;
  header?: string;
  video?: string;
  controls?: string;
}

export interface VideoPlayerProps {
  classes?: VideoPlayerClasses;
  peer: HMSPeer;
}

const defaultClasses: VideoPlayerClasses = {
  root: 'relative w-full h-full',
  header:
    'w-full h-7 flex justify-between items-center bg-gray-100 px-3 text-gray-500',
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
  const currentVideo = useHMSStore(
    selectPlaylistCurrentSelection(HMSPlaylistType.video),
  );

  return (
    <div className={styler('root')}>
      <div className={styler('header')}>
        <Text variant="body" size="sm">
          Video Player
        </Text>
        <Text variant="body" size="sm">
          {currentVideo?.name}
        </Text>
        <Button
          key="closeVideoPlayer"
          iconOnly
          variant="no-fill"
          iconSize="sm"
          shape="rectangle"
          onClick={() => {}}
        >
          <CloseIcon />
        </Button>
      </div>
      <Video
        hmsVideoTrack={videoTrack}
        objectFit="cover"
        classes={{ video: 'static rounded-none' }}
      />
      <PlaylistControls
        classes={{ root: 'absolute left-0 bottom-3 w-full flex-col-reverse' }}
        type={HMSPlaylistType.video}
      />
    </div>
  );
};
