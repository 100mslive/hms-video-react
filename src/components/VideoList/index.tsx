import React from 'react';
import { AudioLevelDisplayType, Peer, MediaStreamWithInfo } from '../../types';
import { VideoTile } from '../VideoTile/index';
import ContainerDimensions from 'react-container-dimensions';
// @ts-ignore
import { largestRect } from 'rect-scaler';
import { Avatar } from '../Avatar';

import * as CSS from 'csstype';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider, { CustomArrowProps } from 'react-slick';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronDown,
  faChevronLeft,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';

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
    videoTileRoot?: string;
    video?: string;
  };
  maxRowCount?: number;
  maxColCount?: number;
}

export const VideoList = ({
  streams,
  overflow = 'scroll-x',
  maxTileCount,
  tileArrangeDirection = 'row',
  dominantSpeakers,
  objectFit = 'cover',

  aspectRatio = { width: 1, height: 1 },
  displayShape = 'rectangle',
  audioLevelDisplayType,
  showAudioLevel,
  classes,
  maxRowCount,
  maxColCount,
}: VideoListProps) => {
  let videoCount = streams.length;
  aspectRatio =
    displayShape == 'circle' ? { width: 1, height: 1 } : aspectRatio;

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
      let rows = maxRowCount;
      //let width = parentWidth / cols;
      let height = parentHeight / rows;

      let cols = Math.floor(parentWidth / height);
      let width = parentWidth / cols;
      cols = cols == 0 ? 1 : cols;
      console.log(cols, 'hii');

      videoCount = rows * cols;
      return {
        ...largestRect(width, height, 1, aspectRatio.width, aspectRatio.height),
      };
    } else if (maxColCount) {
      let cols = maxColCount;
      //let width = parentWidth / cols;
      let width = parentWidth / cols;
      //let height = (width * aspectRatio.height) / aspectRatio.width;

      let rows = Math.floor(parentHeight / width);
      rows = rows == 0 ? 1 : rows;
      console.log(rows, width, parentHeight, 'row calculation here');
      let height = parentHeight / rows;
      videoCount = rows * cols;

      return {
        ...largestRect(width, height, 1, aspectRatio.width, aspectRatio.height),
        rows,
        cols,
      };
    } else
      return largestRect(
        parentWidth,
        parentHeight,
        videoCount,
        aspectRatio.width,
        aspectRatio.height,
      );
  };

  function SampleNextArrow(props: CustomArrowProps) {
    const { style, onClick } = props;
    return (
      <div
        className="slick-arrow absolute top-1/2 right-0 z-2"
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      >
        <button className="text-2xl bg-white rounded-sm">
          <FontAwesomeIcon
            icon={overflow === 'scroll-x' ? faChevronRight : faChevronDown}
          />
        </button>
      </div>
    );
  }

  function SamplePrevArrow(props: CustomArrowProps) {
    const { style, onClick } = props;
    return (
      <div
        className=" top-1/2 z-10 absolute"
        style={{ ...style, display: 'block' }}
        onClick={onClick}
      >
        <button className="text-2xl bg-white rounded-sm">
          <FontAwesomeIcon
            icon={overflow === 'scroll-x' ? faChevronLeft : faChevronUp}
          />
        </button>
      </div>
    );
  }

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,

    swipeToSlide: true,
    vertical: overflow === 'scroll-y',
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    //arrows: false,

    //can be exposed a props
    // centerMode: true,
  };

  return (
    <div
      className={`h-full w-full flex flex-wrap justify-center content-evenly justify-items-center flex-${tileArrangeDirection} `}
    >
      <ContainerDimensions>
        {({ width, height }) => {
          let dimensions = getTileDimensions(width, height);
          let w = dimensions.width;
          let h = dimensions.height;
          console.log(dimensions);
          console.log(width, height);
          console.log(videoCount);
          return (
            <Slider {...settings} className="w-full h-full">
              {streams
                .reduce(
                  (
                    resultArray: JSX.Element[][],
                    item: MediaStreamWithInfo,
                    index: number,
                  ) => {
                    const chunkIndex = Math.floor(index / videoCount);

                    if (chunkIndex > 0 && overflow === 'hidden') {
                      return resultArray;
                    }

                    if (!resultArray[chunkIndex]) {
                      resultArray[chunkIndex] = []; // start a new chunk
                    }

                    resultArray[chunkIndex].push(
                      <div
                        style={{ height: h, width: w }}
                        key={item.peer.displayName}
                        className="flex justify-center"
                      >
                        <VideoTile
                          {...item}
                          objectFit={objectFit}
                          displayShape={displayShape}
                          audioLevelDisplayType={audioLevelDisplayType}
                          showAudioLevel={showAudioLevel}
                          classes={{
                            root: classes?.videoTileRoot,
                            video: classes?.video,
                          }}
                          aspectRatio={aspectRatio}
                        />
                      </div>,
                    );
                    //console.log(resultArray, streams.length, index, videoCount);
                    return resultArray;
                  },
                  [],
                )
                .map((item, index) => {
                  return (
                    <div className="w-full h-full">
                      <div
                        className={`h-full w-full flex flex-wrap justify-center items-center  flex-${
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
