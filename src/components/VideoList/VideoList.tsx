import React, { useRef, useState } from 'react';
import { AudioLevelDisplayType, Peer, MediaStreamWithInfo } from '../../types';
import { VideoTile } from '../VideoTile/index';
import { chunkStreams } from '../../utils';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider, { Settings } from 'react-slick';
import './index.css';
import {
  SliderRightArrow,
  SliderDownArrow,
  SliderLeftArrow,
  SliderUpArrow,
  HorizontalDots,
} from '../../icons';
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
  aspectRatio,
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
  const horizontalNavContainer = useRef(null);
  const horizontalDotsContainer = useRef(null);
  const leftNavContainer = useRef(null);
  const rightNavContainer = useRef(null);



  var settings:Settings = {
    dots: false,
    infinite: false,
    speed: 500,
    swipeToSlide: true,
    vertical: overflow === 'scroll-y',
    nextArrow:
      overflow === 'scroll-x' ? <SliderRightArrow container={rightNavContainer.current} /> : <SliderDownArrow />,
    prevArrow:
      overflow === 'scroll-x' ? <SliderLeftArrow container={leftNavContainer.current}/> : <SliderUpArrow />,
    customPaging:(index) => <HorizontalDots container={horizontalDotsContainer.current} index={index}/>
  };

  //Flooring since there's a bug in react-slick where it converts widdh into a number
  const chunkedStreams = chunkStreams({streams, parentWidth:Math.floor(width), parentHeight:Math.floor(height), maxTileCount, maxRowCount, maxColCount, aspectRatio, onlyOnePage:overflow==='hidden'});
  console.log(
    `HMSui-component: [VideoList] Chunked Streams are 
    }`, chunkedStreams
  );

  return (
    <div
      className={`${classes?.root} relative h-full w-full flex flex-wrap justify-center content-evenly justify-items-center flex-${tileArrangeDirection} `}
      ref={ref}
    >
      <Slider {...settings} className="w-full h-full">
        {
          chunkedStreams.map((streams, page) => {return (
            <div className="w-full h-full" key={page}>
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
              {streams.map((stream, index)=>{
                return (
                  <div
                  style={{ height: stream.height, width: stream.width }}
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
                )
              })

              }

            </div>
          </div>

          )}
          )}
      </Slider>

      <div className="absolute bottom-0 w-full flex justify-center">
        <div ref={leftNavContainer}/>
        <div ref={horizontalDotsContainer}/>            
        <div ref={rightNavContainer}/>        
      </div>
    </div>
  );
};
