import React, { useEffect, useRef, useState } from 'react';
import { AudioLevelDisplayType, Peer, MediaStreamWithInfo } from '../../types';
import { VideoTile } from '../VideoTile/index';
import ContainerDimensions from 'react-container-dimensions';
// @ts-ignore
import { largestRect } from 'rect-scaler';
import { Avatar } from '../Avatar';

import * as CSS from 'csstype';
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
  maxTileHeight,
  maxTileWidth,
  overflow,
  maxTileCount,
  tileArrangeDirection = 'row',
  dominantSpeakers,
  className,
  displayFit = 'contain',
  aspectRatio = { width: 16, height: 9 },
  displayShape = 'rectangle',
  audioLevelDisplayType,
}: VideoListProps) => {
  let height: number;
  let width: number;
  let videoCount: number = maxTileCount
    ? Math.min(streams.length, maxTileCount)
    : streams.length;

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
            <React.Fragment>
              {streams.slice(0, videoCount).map((item, index) => {
                return (
                  <div style={{ maxHeight: h, maxWidth: w }} key={index}>
                    <VideoTile
                      {...item}
                      displayFit={displayFit}
                      displayShape={displayShape}
                      audioLevelDisplayType={audioLevelDisplayType}
                    />
                  </div>
                );
              })}
            </React.Fragment>
          );
        }}
      </ContainerDimensions>
    </div>
  );
};
