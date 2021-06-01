import React, { useMemo } from 'react';
import { AudioLevelDisplayType } from '../../types';
import { VideoTile } from '../VideoTile';
import {
  chunkElements,
  getModeAspectRatio,
  calculateLayoutSizes,
} from '../../utils';
import { Carousel } from '../Carousel';
import { useResizeDetector } from 'react-resize-detector';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { HMSPeer, HMSTrack, HMSTrackID } from '../../store/schema';
import { useHMSStore } from '../../hooks/HMSRoomProvider';
import { selectTracksMap } from '../../store/selectors';
import {
  getVideoTracksFromPeers,
  TrackWithPeer,
} from '../../utils/videoListUtils';

export interface VideoListClasses extends VideoTileClasses {
  /**
   * Styles applied to the root element
   */
  root?: string;
  /**
   * Styles applied to the slider root
   */
  sliderRoot?: string;
  /**
   * Styles applied to the slider inner container
   */
  sliderInner?: string;
  /**
   * Styles applied to the list container
   */
  listContainer?: string;
  /**
   * Styles applited to the container of all video tiles
   */
  videoTileContainer?: string;
  /**
   * Styles applied to individual video tiles
   */
  videoTile?: string;
  /**
   * Styles applied to the video
   */
  video?: string;
}
export interface VideoListProps {
  /**
    HMS Peers who need to be displayed
    */
  peers: HMSPeer[];
  /**
   * a function which tells whether to show the screenshare for a peer. A peer
   * id is passed and a boolean value is expected. You can use it to disable
   * showing main screenshare if you're already showing it in a bigger tile for eg.
   * @param peerID the peer ID for whom video tile is going to be rendered
   */
  showScreenFn?: (peer: HMSPeer) => boolean;
  /**
   * Max tiles in a  page. Overrides maxRowCount and maxColCount
   */
  maxTileCount?: number;
  /**
   * Max rows in a  page. Only applied if maxTileCount is not present
   */
  maxRowCount?: number;
  /**
   * Max columns in a  page. Only applied if maxTileCount and maxRowCount is not present
   */
  maxColCount?: number;
  /**
   * Should the next page scroll vertically, horizontally or be hidden
   */
  overflow?: 'scroll-x' | 'scroll-y' | 'hidden';
  /**
   * Arrange tiles in a row or col. Similar to flex-direction
   */
  tileArrangeDirection?: 'row' | 'col';
  /**
   Indicates if Audio Status will be shown or not.
   */
  showAudioMuteStatus?: boolean;
  /**
   * Contain the video or cover the video in a tile
   */
  objectFit?: 'contain' | 'cover';
  /**
   Aspect ratio in which the video tile should be shown, will only be applied if display shape is rectangle.
   If undefined, then the most common aspect ratio among all peer's feed will be chosen
   */
  aspectRatio?: {
    width: number;
    height: number;
  };
  /**
   Shape of the video tile, you can control the aspect ratio using aspectRatio props.
   */
  displayShape?: 'circle' | 'rectangle';
  /**
  Sets display type of Audio Level, inline-wave, inline-circle, border, avatar-circle are types available.
   */
  audioLevelDisplayType?: AudioLevelDisplayType;
  /**
    Show audio level for each tile?
   */
  showAudioLevel?: boolean;
  /**
   * Show control bars on all video tiles
   */
  videoTileControls?: React.ReactNode[];
  /**
   * Allow local peer to mute remote peers?
   */
  allowRemoteMute?: boolean;
  /**
   * extra classes added  by user
   */
  classes?: VideoListClasses;
  /**
   * videoTileClasses
   */
  videoTileClasses?: VideoTileClasses;

  avatarType?: 'initial';
  compact?: boolean;
}

const defaultClasses: VideoListClasses = {
  root:
    'relative h-full w-full flex flex-wrap justify-center content-evenly justify-items-center bg-white dark:bg-black',
  sliderRoot: 'w-full h-full',
  sliderInner: 'w-full h-full',
  listContainer:
    'relative h-full w-full flex flex-wrap justify-center items-center content-center',
  videoTileContainer: 'flex justify-center p-3',
};

export const VideoList = ({
  peers,
  showScreenFn = () => true,
  overflow = 'scroll-x',
  maxTileCount,
  tileArrangeDirection = 'row',
  objectFit = 'cover',
  aspectRatio,
  displayShape = 'rectangle',
  audioLevelDisplayType,
  showAudioLevel,
  maxRowCount,
  maxColCount,
  videoTileControls,
  showAudioMuteStatus = true,
  classes,
  videoTileClasses,
  allowRemoteMute,
  avatarType,
  compact = false,
}: VideoListProps) => {
  const { tw, appBuilder } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<VideoListClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-videoList',
      }),
    [],
  );
  const tracksMap: Record<HMSTrackID, HMSTrack> = useHMSStore(selectTracksMap);
  const { width = 0, height = 0, ref } = useResizeDetector();

  if (aspectRatio === undefined) {
    aspectRatio = appBuilder.videoTileAspectRatio;
  }
  aspectRatio =
    displayShape === 'circle' ? { width: 1, height: 1 } : aspectRatio;

  const tracksWithPeer: TrackWithPeer[] = getVideoTracksFromPeers(
    peers,
    tracksMap,
    showScreenFn,
  );

  const finalAspectRatio = useMemo(() => {
    if (aspectRatio) {
      return aspectRatio;
    } else {
      const modeAspectRatio = getModeAspectRatio(tracksWithPeer);
      //Default to 1 if there are no video tracks
      return {
        width: modeAspectRatio ? modeAspectRatio : 1,
        height: 1,
      };
    }
  }, [aspectRatio, tracksWithPeer]);

  const count = tracksWithPeer.length;
  const {
    tilesInFirstPage,
    defaultWidth,
    defaultHeight,
    lastPageWidth,
    lastPageHeight,
    isLastPageDifferentFromFirstPage,
  } = useMemo(() => {
    //Flooring since there's a bug in react-slick where it converts widdh into a number
    return calculateLayoutSizes({
      count,
      parentWidth: Math.floor(width),
      parentHeight: Math.floor(height),
      maxTileCount,
      maxRowCount,
      maxColCount,
      aspectRatio: finalAspectRatio,
    });
  }, [
    count,
    width,
    height,
    maxTileCount,
    maxRowCount,
    maxColCount,
    finalAspectRatio,
  ]);

  const chunkedTracksWithPeer = useMemo(() => {
    return chunkElements<TrackWithPeer>({
      elements: tracksWithPeer,
      tilesInFirstPage,
      onlyOnePage: overflow === 'hidden',
      isLastPageDifferentFromFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
    });
  }, [
    tracksWithPeer,
    tilesInFirstPage,
    overflow,
    width,
    height,
    maxColCount,
    maxRowCount,
    finalAspectRatio,
  ]);

  return (
    <div className={`${styler('root')}`}>
      <Carousel ref={ref}>
        {chunkedTracksWithPeer &&
          chunkedTracksWithPeer.length > 0 &&
          chunkedTracksWithPeer.map((tracksPeersOnOnePage, page) => {
            return (
              <div className={`${styler('sliderInner')}`} key={page}>
                <div
                  className={` ${styler('listContainer')}   flex-${
                    maxRowCount
                      ? 'col'
                      : maxColCount
                      ? 'row'
                      : tileArrangeDirection
                  } `}
                >
                  {tracksPeersOnOnePage.map((trackPeer, index) => {
                    return (
                      <div
                        key={trackPeer.track.id} // track id changes on replace track
                        style={{
                          height: trackPeer.height,
                          width: trackPeer.width,
                        }}
                        className={`${styler('videoTileContainer')}`}
                      >
                        <VideoTile
                          peer={trackPeer.peer}
                          hmsVideoTrack={trackPeer.track}
                          objectFit={objectFit}
                          displayShape={displayShape}
                          audioLevelDisplayType={audioLevelDisplayType}
                          allowRemoteMute={allowRemoteMute}
                          showAudioLevel={showAudioLevel}
                          showAudioMuteStatus={showAudioMuteStatus}
                          aspectRatio={aspectRatio}
                          classes={videoTileClasses}
                          controlsComponent={
                            videoTileControls && videoTileControls[index]
                          }
                          avatarType={avatarType}
                          compact={compact}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </Carousel>
    </div>
  );
};
