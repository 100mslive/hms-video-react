import React, { useEffect, useRef, useState } from 'react';
import { AudioLevelDisplayType, Peer, MediaStreamWithInfo } from '../../types';
import { VideoTile } from '../VideoTile/index';
import ContainerDimensions from 'react-container-dimensions';
// @ts-ignore
import { largestRect } from 'rect-scaler';
import { Avatar } from '../Avatar';

import * as CSS from 'csstype';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import './index.css';

export interface VideoListProps {
  /**
    MediaStream to be displayed.
    */
  streams: MediaStreamWithInfo[];
  maxTileHeight?: CSS.Property.MaxHeight;
  maxTileWidth?: CSS.Property.MaxWidth;
  maxTileCount?: number;
  overflow?: 'scroll-x' | 'scroll-y' | 'hidden';
  tileArrangeDirection?: 'row' | 'col';
  dominantSpeakers?: Peer[];

  /**
    Additional classnames to be applied.
    */
  className?: string;
  /**
   Indicates if Audio Status will be shown or not.
   */
  showAudioMuteStatus?: boolean;
  displayFit?: 'contain' | 'cover';
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
}

export const VideoList = ({
  streams,
  overflow = 'scroll-x',
  maxTileCount,
  tileArrangeDirection = 'row',
  dominantSpeakers,
  className,
  displayFit = 'contain',
  aspectRatio = { width: 1, height: 1 },
  displayShape = 'rectangle',
  audioLevelDisplayType,
}: VideoListProps) => {
  let height: number;
  let width: number;
  let videoCount = streams.length;
  aspectRatio =
    displayShape == 'circle' ? { width: 1, height: 1 } : aspectRatio;
  if (maxTileCount) {
    videoCount = Math.min(streams.length, maxTileCount);
  }

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,

    swipeToSlide: true,
    vertical: overflow === 'scroll-y',

    //can be exposed a props
    // centerMode: true,
  };

  return (
    <div
      className={`h-full w-full flex flex-wrap justify-center content-evenly justify-items-center ${className} flex-${tileArrangeDirection} `}
    >
      <ContainerDimensions>
        {({ width, height }) => {
          let w = '100%';
          let h = '100%';

          let largestRectObj = largestRect(
            width,
            height,
            videoCount,
            aspectRatio.width,
            aspectRatio.height
          );
          w = largestRectObj.width;
          h = largestRectObj.height;
          console.log(largestRectObj);
          console.log(width, height);
          console.log(videoCount);
          return (
            <Slider {...settings} className="w-full h-full">
              {streams
                .reduce(
                  (
                    resultArray: JSX.Element[][],
                    item: MediaStreamWithInfo,
                    index: number
                  ) => {
                    const chunkIndex = Math.floor(index / videoCount);

                    if (chunkIndex > 0 && overflow == 'hidden')
                      return resultArray;

                    if (!resultArray[chunkIndex]) {
                      resultArray[chunkIndex] = []; // start a new chunk
                    }

                    resultArray[chunkIndex].push(
                      <div
                        style={{ height: h, width: w }}
                        key={item.peer.displayName}
                        className="p-2"
                      >
                        <VideoTile
                          {...item}
                          displayFit={displayFit}
                          displayShape={displayShape}
                          audioLevelDisplayType={audioLevelDisplayType}
                          showAudioLevel={true}
                        />
                      </div>
                    );
                    console.log(resultArray);
                    return resultArray;
                  },
                  []
                )
                .map((item, index) => {
                  return (
                    <div className="w-full h-full">
                      <div
                        className={`h-full w-full flex flex-wrap justify-center content-evenly justify-items-center ${className} flex-${tileArrangeDirection} `}
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
