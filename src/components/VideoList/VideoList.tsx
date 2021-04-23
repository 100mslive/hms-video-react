import React, { useState } from 'react';
import { AudioLevelDisplayType, Peer, MediaStreamWithInfo } from '../../types';
import { VideoTile } from '../VideoTile/index';
import { largestRect } from '../../utils';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import './index.css';
import {
  SliderRightArrow,
  SliderDownArrow,
  SliderLeftArrow,
  SliderUpArrow,
} from '../../icons';
import {
  colToRowTransform,
  groupTilesIntoPage,
  rowToColTransform,
} from '../../utils/index';
import { useResizeDetector } from 'react-resize-detector';

export interface VideoListProps {
  /**
    MediaStream to be displayed.
    */
  streams: MediaStreamWithInfo[];

  maxTileCount?: number;
  overflow?: 'scroll-x' | 'scroll-y' | 'hidden';
  tileArrangeDirection?: 'row' | 'col';
  dominantSpeakers?: Peer[];

  /**
   Indicates if Audio Status will be shown or not.
   */
  showAudioMuteStatus?: boolean;
  objectFit?: 'contain' | 'cover';
  /**
   Aspect ratio in which the video tile should be shown, will only be applied if display shape is rectangle.
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
  showAudioLevel?: boolean;
  classes?: {
    root?: string;
    videoTileParent?: string;
    videoTile?: string;
    video?: string;
  };
  maxRowCount?: number;
  maxColCount?: number;
  videoTileControls?: React.ReactNode[];
  allowRemoteMute?: boolean;
}

export const VideoList = ({
  streams,
  overflow = 'scroll-x',
  maxTileCount,
  tileArrangeDirection = 'row',
  objectFit = 'cover',
  aspectRatio = { width: 1, height: 1 },
  displayShape = 'rectangle',
  audioLevelDisplayType,
  showAudioLevel,
  classes,
  maxRowCount,
  maxColCount,
  videoTileControls,
  showAudioMuteStatus,
}: VideoListProps) => {
  const { width = 0, height = 0, ref } = useResizeDetector();
  aspectRatio =
    displayShape === 'circle' ? { width: 1, height: 1 } : aspectRatio;

  const getTileDimensions = (
    parentWidth: number,
    parentHeight: number,
  ): {
    width: number;
    height: number;
    rows: number;
    cols: number;
    videoCount: number;
  } => {
    if (maxTileCount) {
      return {
        ...largestRect(
          parentWidth,
          parentHeight,
          Math.min(streams.length, maxTileCount),
          aspectRatio.width,
          aspectRatio.height,
        ),
        videoCount: Math.min(streams.length, maxTileCount),
      };
    } else if (maxRowCount) {
      //let cols = ;
      let rows = Math.min(maxRowCount, streams.length);
      //let width = parentWidth / cols;
      let height = parentHeight / rows;

      let cols = Math.floor(parentWidth / height);
      let width = parentWidth / cols;
      cols = cols === 0 ? 1 : cols;

      return {
        ...largestRect(width, height, 1, aspectRatio.width, aspectRatio.height),
        videoCount: rows * cols,
      };
    } else if (maxColCount) {
      let cols = Math.min(maxColCount, streams.length);
      //let width = parentWidth / cols;
      let width = parentWidth / cols;
      //let height = (width * aspectRatio.height) / aspectRatio.width;

      let rows = Math.floor(parentHeight / width);
      rows = rows === 0 ? 1 : rows;

      let height = parentHeight / rows;

      return {
        ...largestRect(width, height, 1, aspectRatio.width, aspectRatio.height),
        rows,
        cols,
        videoCount: rows * cols,
      };
    } else {
      return {
        ...largestRect(
          parentWidth,
          parentHeight,
          streams.length,
          aspectRatio.width,
          aspectRatio.height,
        ),
        videoCount: streams.length,
      };
    }
  };

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    swipeToSlide: true,
    vertical: overflow === 'scroll-y',
    nextArrow:
      overflow === 'scroll-x' ? <SliderRightArrow /> : <SliderDownArrow />,
    prevArrow:
      overflow === 'scroll-x' ? <SliderLeftArrow /> : <SliderUpArrow />,
    //arrows: false,
    //can be exposed a props
    // centerMode: true,
  };

  const dimensions = getTileDimensions(width, height);
  const { width: w, height: h, videoCount } = dimensions;
  console.log(
    `SDK-Component: ${JSON.stringify(
      dimensions,
    )}, parentHeight:${width} , parentwidth:${height}  , streams: ${
      streams.length
    }`,
  );

  return (
    <div
      className={`${classes?.root} h-full w-full flex flex-wrap justify-center content-evenly justify-items-center flex-${tileArrangeDirection} `}
      ref={ref}
    >
      <Slider {...settings} className="w-full h-full">
        {groupTilesIntoPage(
          streams.map((stream, index) => (
            <div
              style={{ height: h, width: w }}
              key={stream.peer.id}
              className={`${classes?.videoTileParent} flex justify-center`}
            >
              <VideoTile
                {...stream}
                objectFit={objectFit}
                displayShape={displayShape}
                audioLevelDisplayType={audioLevelDisplayType}
                showAudioLevel={showAudioLevel}
                showAudioMuteStatus={showAudioMuteStatus}
                aspectRatio={aspectRatio}
                controlsComponent={
                  videoTileControls && videoTileControls[index]
                }
              />
            </div>
          )),
          videoCount,
          overflow === 'hidden',
        )
          .map(page => {
            if (
              tileArrangeDirection === 'col' &&
              !maxTileCount &&
              !maxRowCount &&
              maxColCount &&
              maxColCount < page.length
            ) {
              return colToRowTransform(page, maxColCount);
            } else if (
              tileArrangeDirection === 'row' &&
              maxRowCount &&
              !maxTileCount &&
              maxRowCount < page.length
            ) {
              return rowToColTransform(page, maxRowCount);
            }
            return page;
          })
          .map(item => {
            return (
              <div className="w-full h-full">
                <div
                  className={` ${
                    classes?.root
                  } h-full w-full flex flex-wrap justify-center items-center content-center  flex-${
                    maxRowCount
                      ? 'col'
                      : maxColCount
                      ? 'row'
                      : tileArrangeDirection
                  } `}
                >
                  {item}
                </div>
              </div>
            );
          })}
      </Slider>
    </div>
  );
};
