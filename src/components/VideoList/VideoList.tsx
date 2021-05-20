import React, { useMemo, useCallback } from 'react';
import { AudioLevelDisplayType, Peer, MediaStreamWithInfo } from '../../types';
import { VideoTile } from '../VideoTile';
import {
  chunkStreams,
  getModeAspectRatio,
  calculateLayoutSizes,
} from '../../utils';
import { Carousel } from '../Carousel';
import { useResizeDetector } from 'react-resize-detector';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';

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
    MediaStream to be displayed.
    */
  streams: MediaStreamWithInfo[];
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
   If undefined, then the most common aspect ratio among all video streams will be chosen
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

  avatarType?: 'initial' | 'pebble';
}

const defaultClasses: VideoListClasses = {
  root:
    'relative h-full w-full flex flex-wrap justify-center content-evenly justify-items-center bg-white dark:bg-black',
  sliderRoot: 'w-full h-full',
  sliderInner: 'w-full h-full',
  listContainer:
    'relative h-full w-full flex flex-wrap justify-center items-center content-center',
  videoTileContainer: 'flex justify-center',
};

export const VideoList = ({
  streams,
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
  showAudioMuteStatus,
  classes,
  videoTileClasses,
  allowRemoteMute,
  avatarType,
}: VideoListProps) => {
  const parseClass = useCallback(
    hmsUiClassParserGenerator<VideoListClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-videoList',
    }),
    [],
  );

  const { width = 0, height = 0, ref } = useResizeDetector();

  try {
    let context = useHMSTheme();
    if (aspectRatio === undefined) {
      aspectRatio = context.appBuilder.videoTileAspectRatio;
    }
  } catch (e) {}
  aspectRatio =
    displayShape === 'circle' ? { width: 1, height: 1 } : aspectRatio;

  const finalAspectRatio = useMemo(() => {
    if (aspectRatio) {
      return aspectRatio;
    } else {
      const modeAspectRatio = getModeAspectRatio(streams);
      //Default to 1 if there are no video tracks
      return {
        width: !isNaN(modeAspectRatio) && modeAspectRatio ? modeAspectRatio : 1,
        height: 1,
      };
    }
  }, [aspectRatio, streams]);

  const count = streams.length;
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

  const chunkedStreams = useMemo(() => {
    return chunkStreams({
      streams,
      tilesInFirstPage,
      onlyOnePage: overflow === 'hidden',
      isLastPageDifferentFromFirstPage,
      defaultWidth,
      defaultHeight,
      lastPageWidth,
      lastPageHeight,
    });
  }, [
    streams,
    tilesInFirstPage,
    overflow,
    width,
    height,
    maxColCount,
    maxRowCount,
    finalAspectRatio,
  ]);

  return (
    <div className={`${parseClass('root')}`} ref={ref}>
      {chunkedStreams && chunkedStreams.length > 0 && (
        <Carousel>
          {chunkedStreams.map((streams, page) => {
            return (
              <div className={`${parseClass('sliderInner')}`} key={page}>
                <div
                  className={` ${parseClass('listContainer')}   flex-${
                    maxRowCount
                      ? 'col'
                      : maxColCount
                      ? 'row'
                      : tileArrangeDirection
                  } `}
                >
                  {streams.map((stream, index) => {
                    return (
                      <div
                        style={{ height: stream.height, width: stream.width }}
                        key={stream.peer.id}
                        className={`${parseClass('videoTileContainer')}`}
                      >
                        <VideoTile
                          audioTrack={stream.audioTrack}
                          videoTrack={stream.videoTrack}
                          isLocal={stream.peer.isLocal}
                          peer={stream.peer}
                          hmsVideoTrack={stream.hmsVideoTrack}
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
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Carousel>
      )}
    </div>
  );
};
