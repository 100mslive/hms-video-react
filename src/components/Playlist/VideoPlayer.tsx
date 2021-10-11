import React, { useMemo, useRef, useState } from 'react';
import {
  HMSPeer,
  HMSPlaylistType,
  selectVideoPlaylistVideoTrackByPeerID,
  selectVideoPlaylist,
} from '@100mslive/hms-video-store';
import { PlaylistControls } from './PlaylistControls';
import { Video } from '../Video/Video';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Text } from '../Text';
import { Button } from '../Button';
import { CloseIcon } from '../Icons';
import { toggleFullScreen } from '../../utils';

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
    'w-full h-7 flex justify-between items-center bg-gray-100 text-gray-500',
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
    [],
  );
  const videoTrack = useHMSStore(
    selectVideoPlaylistVideoTrackByPeerID(peer.id),
  );
  const currentVideo = useHMSStore(selectVideoPlaylist.selectedItem);
  const hmsActions = useHMSActions();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = async () => {
    if (!rootRef.current) {
      return;
    }
    const fs = await toggleFullScreen(rootRef.current, !isFullScreen);
    if (fs !== undefined) {
      setIsFullScreen(fs);
    }
  };

  return (
    <div className={styler('root')} ref={rootRef}>
      {currentVideo && (
        <div className={styler('header')}>
          <Text variant="body" size="sm" classes={{ root: 'px-2' }}>
            Video Player
          </Text>
          <Text variant="body" size="sm">
            {currentVideo?.name}
          </Text>
          <Button
            key="closeVideoPlayer"
            iconOnly
            variant="no-fill"
            size="sm"
            shape="rectangle"
            onClick={async () => {
              await hmsActions.videoPlaylist.stop();
            }}
          >
            <CloseIcon />
          </Button>
        </div>
      )}
      <Video
        hmsVideoTrackId={videoTrack?.id}
        objectFit="cover"
        classes={{ video: 'static rounded-none' }}
      />
      <PlaylistControls
        classes={{ root: 'absolute left-0 bottom-3 w-full flex-col-reverse' }}
        type={HMSPlaylistType.video}
        toggleFullScreen={handleFullScreen}
        isFullScreen={isFullScreen}
      />
    </div>
  );
};
