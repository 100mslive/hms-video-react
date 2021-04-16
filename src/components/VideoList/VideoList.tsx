import React from 'react';
import { AudioLevelDisplayType, Peer, MediaStreamWithInfo } from '../../types';
import { VideoTile } from '../VideoTile/index';
import ContainerDimensions from 'react-container-dimensions';
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
  console.log(showAudioMuteStatus, ' audiomute status');
  let videoCount = streams.length;
  aspectRatio =
    displayShape === 'circle' ? { width: 1, height: 1 } : aspectRatio;

  const getTileDimensions = (
    parentWidth: number,
    parentHeight: number,
  ): { width: number; height: number; rows: number; cols: number } => {
    if (maxTileCount) {
      videoCount = Math.min(streams.length, maxTileCount);

      let largestRectObj = largestRect(
        parentWidth,
        parentHeight,
        videoCount,
        aspectRatio.width,
        aspectRatio.height,
      );
      return largestRectObj;
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
      };
    } else {
      return largestRect(
        parentWidth,
        parentHeight,
        videoCount,
        aspectRatio.width,
        aspectRatio.height,
      );
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

  return (
    <div
      className={`${classes?.root} h-full w-full flex flex-wrap justify-center content-evenly justify-items-center flex-${tileArrangeDirection} `}
    >
      <ContainerDimensions>
        {({ width, height }) => {
          let dimensions = getTileDimensions(width, height);
          let w = dimensions.width;
          let h = dimensions.height;
          console.log(dimensions);
          console.log(width, height);
          console.log(videoCount);
          console.log(streams[0]);
          return (
            <Slider {...settings} className="w-full h-full">
              {groupTilesIntoPage(
                streams.map((stream, index) => (
                  <div
                    style={{ height: h, width: w }}
                    key={stream.peer.displayName}
                    className={`${classes?.videoTileParent} flex justify-center`}
                  >
                    <VideoTile
                      {...stream}
                      objectFit={objectFit}
                      displayShape={displayShape}
                      audioLevelDisplayType={audioLevelDisplayType}
                      showAudioLevel={showAudioLevel}
                      showAudioMuteStatus={showAudioMuteStatus}
                      classes={{
                        root: classes?.videoTile,
                        video: classes?.video,
                      }}
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
                .map((page) => {
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
                .map((item) => {
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
          );
        }}
      </ContainerDimensions>
    </div>
  );
};
