import React, { useRef } from 'react';
import { AudioLevelDisplayType, Peer, MediaStreamWithInfo } from '../../types';
import { VideoTile } from '../VideoTile/index';
import { chunkStreams } from '../../utils';
import { withClasses } from '../../utils/styles';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider, { Settings } from 'react-slick';
import './index.css';
import {
  LeftCaratIcon,
  RightCaratIcon,
  DownCaratIcon,
  UpCaratIcon,
  DotIcon,
} from '../Icons';
import { createPortal } from 'react-dom';
import { CustomArrowProps } from 'react-slick';
import { useResizeDetector } from 'react-resize-detector';
import { combineClasses } from '../../utils';
import { VideoTileClasses } from '../VideoTile/VideoTile';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';

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
interface StyledVideoListProps {
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
   * Dominant speakers
   */
  dominantSpeakers?: Peer[];
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
   * default classes
   */
  defaultClasses?: VideoListClasses;
  /**
   * extra classes added  by user
   */
  classes?: VideoListClasses;
}

const defaultClasses: VideoListClasses = {
  root:
    'relative h-full w-full flex flex-wrap justify-center content-evenly justify-items-center',
  sliderRoot: 'w-full h-full',
  sliderInner: 'w-full h-full',
  listContainer:
    'relative h-full w-full flex flex-wrap justify-center items-center content-center',
  videoTileContainer: 'flex justify-center',
};

interface IArrowProps extends CustomArrowProps {
  container: HTMLElement | null;
}

export function SliderRightArrow({ container, ...props }: IArrowProps) {
  const { style, onClick } = props;
  const RightArrow = (
    <div className="" style={{ ...style, display: 'block' }} onClick={onClick}>
      <button className="text-sm text-brand-main focus:outline-none">
        <RightCaratIcon />
      </button>
    </div>
  );
  return container ? createPortal(RightArrow, container) : RightArrow;
}

interface IDots {
  container: HTMLElement | null;
  index: number;
}

const HorizontalDots = ({ container, index }: IDots) =>
  container ? (
    createPortal(
    //eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a className="inline-block">
        <DotIcon />
      </a>,
      container,
    )
  ) : (
    <DotIcon />
  );

function SliderDownArrow(props: CustomArrowProps) {
  const { style, onClick } = props;
  return (
    <div
      className="slick-arrow absolute left-1/2 bottom-0 z-10"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <button className="text-2xl rounded-sm focus:outline-none">
        <DownCaratIcon />
      </button>
    </div>
  );
}

function SliderUpArrow(props: CustomArrowProps) {
  const { style, onClick } = props;
  return (
    <div
      className="slick-arrow left-1/2 top-0 z-10 absolute"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <button className="text-2xl  rounded-sm focus:outline-none">
        <UpCaratIcon />
      </button>
    </div>
  );
}

function SliderLeftArrow({ container, ...props }: IArrowProps) {
  const { style, onClick } = props;
  const LeftArrow = (
    <div className="" style={{ ...style, display: 'block' }} onClick={onClick}>
      <button className="text-sm rounded-sm focus:outline-none">
        <LeftCaratIcon />
      </button>
    </div>
  );
  return container ? createPortal(LeftArrow, container) : LeftArrow;
}

export const StyledVideoList = ({
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
  defaultClasses,
  classes: extraClasses,
}: StyledVideoListProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const { width = 0, height = 0, ref } = useResizeDetector();
  try {
    let context = useHMSTheme();
    if (aspectRatio === undefined) {
      aspectRatio = context.appBuilder.videoTileAspectRatio;
    }
    if (showAudioMuteStatus === undefined) {
      showAudioMuteStatus = context.appBuilder.showAvatar;
    }
  } catch (e) {}
  aspectRatio =
    displayShape === 'circle' ? { width: 1, height: 1 } : aspectRatio;
  const horizontalDotsContainer = useRef(null);
  const leftNavContainer = useRef(null);
  const rightNavContainer = useRef(null);

  var settings: Settings = {
    dots: false,
    infinite: false,
    speed: 500,
    swipeToSlide: true,
    vertical: overflow === 'scroll-y',
    nextArrow:
      overflow === 'scroll-x' ? (
        <SliderRightArrow container={rightNavContainer.current} />
      ) : (
        <SliderDownArrow />
      ),
    prevArrow:
      overflow === 'scroll-x' ? (
        <SliderLeftArrow container={leftNavContainer.current} />
      ) : (
        <SliderUpArrow />
      ),
    customPaging: index => (
      <HorizontalDots
        container={horizontalDotsContainer.current}
        index={index}
      />
    ),
  };

  //Flooring since there's a bug in react-slick where it converts widdh into a number
  const chunkedStreams = chunkStreams({
    streams,
    parentWidth: Math.floor(width),
    parentHeight: Math.floor(height),
    maxTileCount,
    maxRowCount,
    maxColCount,
    aspectRatio,
    onlyOnePage: overflow === 'hidden',
  });
  console.log(
    `HMSui-component: [VideoList] Chunked Streams are 
    }`,
    chunkedStreams,
  );

  return (
    <div className={`${combinedClasses?.root}`} ref={ref}>
      <Slider {...settings} className={`${combinedClasses?.sliderRoot}`}>
        {chunkedStreams.map((streams, page) => {
          return (
            <div className={`${combinedClasses?.sliderInner}`} key={page}>
              <div
                className={` ${combinedClasses?.listContainer}   flex-${
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
                      className={`${combinedClasses?.videoTileContainer}`}
                    >
                      <VideoTile
                        {...stream}
                        objectFit={objectFit}
                        displayShape={displayShape}
                        audioLevelDisplayType={audioLevelDisplayType}
                        showAudioLevel={showAudioLevel}
                        showAudioMuteStatus={showAudioMuteStatus}
                        aspectRatio={aspectRatio}
                        classes={{
                          root: combinedClasses?.videoTileRoot,
                          videoContainer: combinedClasses?.videoContainer,
                          avatarContainer: combinedClasses?.avatarContainer,
                          videoContainerCircle:
                            combinedClasses?.videoContainerCircle,
                          video: combinedClasses?.video,
                          videoCircle: combinedClasses?.videoCircle,
                          videoLocal: combinedClasses?.videoLocal,
                          videoCover: combinedClasses?.videoCover,
                          videoContain: combinedClasses?.videoContain,
                          borderAudioRoot: combinedClasses?.borderAudioRoot,
                        }}
                        controlsComponent={
                          videoTileControls && videoTileControls[index]
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Slider>

      <div className="absolute bottom-0 w-full flex justify-center">
        <div ref={leftNavContainer} />
        <div ref={horizontalDotsContainer} />
        <div ref={rightNavContainer} />
      </div>
    </div>
  );
};

export type VideoListProps = Omit<StyledVideoListProps, 'defaultClasses'>;

export const VideoList = withClasses<VideoListClasses | undefined>(
  defaultClasses,
  'videoList',
)<StyledVideoListProps>(StyledVideoList);
