import React, { useEffect, useState } from 'react';
import { AudioLevelDisplayType, Peer, MediaStreamWithInfo } from '../../types';
import { VideoTile } from '../VideoTile/index';
import ContainerDimensions from 'react-container-dimensions';
import { largestRect } from '../../utils';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import ReactResizeDetector, { useResizeDetector } from 'react-resize-detector';
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
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [videoCount, setVideoCount] = useState(streams.length);

  aspectRatio =
    displayShape === 'circle' ? { width: 1, height: 1 } : aspectRatio;
  const {
    width: containerWidth,
    height: containerHeight,
    ref: containerRef,
  } = useResizeDetector();

  const getTileDimensions = (
    parentWidth: number,
    parentHeight: number,
    count: number,
  ): {
    width: number;
    height: number;
    rows: number;
    cols: number;
    videoCount: number;
  } => {
    let videoCount = count;
    if (maxTileCount) {
      videoCount = Math.min(count, maxTileCount);

      let largestRectObj = largestRect(
        parentWidth,
        parentHeight,
        videoCount,
        aspectRatio.width,
        aspectRatio.height,
      );
      return { ...largestRectObj, videoCount };
    } else if (maxRowCount) {
      //let cols = ;
      let rows = Math.min(maxRowCount, videoCount);
      //let width = parentWidth / cols;
      let height = parentHeight / rows;

      let cols = Math.floor(parentWidth / height);
      let width = parentWidth / cols;
      cols = cols === 0 ? 1 : cols;

      videoCount = rows * cols;
      return {
        ...largestRect(width, height, 1, aspectRatio.width, aspectRatio.height),
        videoCount,
      };
    } else if (maxColCount) {
      let cols = Math.min(maxColCount, videoCount);
      //let width = parentWidth / cols;
      let width = parentWidth / cols;
      //let height = (width * aspectRatio.height) / aspectRatio.width;

      let rows = Math.floor(parentHeight / width);
      rows = rows === 0 ? 1 : rows;

      let height = parentHeight / rows;
      videoCount = rows * cols;

      return {
        ...largestRect(width, height, 1, aspectRatio.width, aspectRatio.height),
        rows,
        cols,
        videoCount,
      };
    } else {
      return {
        ...largestRect(
          parentWidth,
          parentHeight,
          videoCount,
          aspectRatio.width,
          aspectRatio.height,
        ),
        videoCount,
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

  useEffect(() => {
    let dimensions = getTileDimensions(
      containerWidth!,
      containerHeight!,
      streams.length,
    );

    let { width: w, height: h, videoCount } = dimensions;
    setHeight(h);
    setWidth(w);
    setVideoCount(videoCount);
    console.log(
      `SDK-Component: ${JSON.stringify(
        dimensions,
      )}, parentHeight:${containerHeight} , parentwidth:${containerWidth}, streams: ${
        streams.length
      }`,
    );
  }, [width, height, streams]);

  return (
    <div className="w-full h-full" ref={containerRef}>
      <Slider {...settings} className="w-full h-full">
        {groupTilesIntoPage(
          streams.map((stream, index) => (
            <div
              style={{ height, width }}
              key={stream.peer.id}
              className={`${classes?.videoTileParent} flex justify-center`}
            >
              {containerHeight && containerWidth && (
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
              )}
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
