import React, { useCallback, useEffect, useRef, useMemo } from 'react';
import { AudioLevelDisplayType } from '../../types';
import { AudioLevelIndicator } from '../AudioLevelIndicators';
import { useInView } from 'react-intersection-observer';
import HMSLogger from '../../utils/ui-logger';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { useHMSActions } from '../../hooks/HMSRoomProvider';
import { HMSTrack } from '../../store/schema';
import {useHMSTheme} from '../../hooks/HMSThemeProvider'

export type DisplayShapes = 'circle' | 'rectangle';

export interface VideoClasses {
  /** The actual video element
   *
   */
  video?: string;
  /**
   * Extra styles added when video is circular
   */
  videoCircle?: string;
  /**
   * Extra styles added when video is local stream
   */
  videoLocal?: string;
  /**
   * Extra styles added when objectFit is set to cover
   */
  videoCover?: string;
  /**
   * Extra styles added when objectFit is contain
   */
  videoContain?: string;
  /**
   * Extra styles added when to audio level border
   */
  borderAudioRoot?: string;
}
export interface VideoProps {
  //TODO make one of audioTrack and videoTrack mandatory instead of both
  /**
   * Native Video Track to be displayed. This is auto inferred and not required if you
   * pass in peer and hmsVideoTrack
   */
  videoTrack?: MediaStreamTrack;
  /**
   * HMS Video Track is for track related metadata
   */
  hmsVideoTrack?: HMSTrack;
  /**
   * Audio Track to be displayed.
   */
  audioTrack?: MediaStreamTrack;
  /**
   * Indicates if the stream belongs to the user viewing it. Used in labelling and styling.
   */
  isLocal?: boolean;
  peerId?: string;
  /**
   * Indicates whether to show the volume of the stream's audio. Needs audioLevel to display the audio level.
   */
  showAudioLevel?: boolean;
  /**
   * Indicates the volume of the stream as a number.
   * Ignored when showAudioLevel is false.
   */
  audioLevel?: number;
  /**
   * Indicates the fit type of the video inside the container.
   * 'contain' - Video is fit inside the container with it's original aspect-ratio.
   * 'cover' - Video is scaled to cover the largest area within the container while maintaining aspectRatio.
   */
  objectFit: 'contain' | 'cover';
  /**
   * Shape of the video tile.
   * Use 'rectangle' and 'aspect ratio' 1:1 for square.
   */
  displayShape?: DisplayShapes;
  /**
   * Indicates how to display the volume of the stream's audio.
   * Supported types are 'border', 'inline-wave' and 'inline-circle'.
   * Ignored if showAudioLevel is set to false.
   */
  audioLevelDisplayType?: AudioLevelDisplayType;
  /**
   * The color of the audio display
   */
  audioLevelDisplayColor?: string;
  /**
   * extra classes added  by user
   */
  classes?: VideoClasses;
}

const defaultClasses: VideoClasses = {
  video: 'h-full w-full rounded-lg absolute left-0 top-0',
  videoCircle: 'rounded-full',
  videoLocal: 'transform -scale-x-100',
  videoCover: 'object-cover',
  videoContain: 'object-contain',
  borderAudioRoot: 'w-full h-full absolute left-0 top-0 rounded-lg',
};

export const Video = ({
  peerId,
  videoTrack,
  hmsVideoTrack,
  objectFit,
  isLocal,
  showAudioLevel,
  audioLevel = 0,
  audioLevelDisplayType,
  audioLevelDisplayColor,
  displayShape,
  classes,
}: VideoProps) => {
  const {tw} = useHMSTheme();
  const styler = useMemo(()=>
    hmsUiClassParserGenerator<VideoClasses>({
      tw,
      classes,
      defaultClasses,
      tag: 'hmsui-video',
    }),[]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const hmsActions = useHMSActions();

  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });

  //TODO replace with mergeRefs
  /**
   * Callback to assign multiple refs(containerRef, inViewRef) to a single component.
   * Refer: [https://github.com/thebuilder/react-intersection-observer#how-can-i-assign-multiple-refs-to-a-component]
   */
  const setRefs = useCallback(
    node => {
      videoRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useEffect(() => {
    (async () => {
      if (videoRef.current && hmsVideoTrack) {
        HMSLogger.d('Video InView', videoTrack, inView);
        if (inView) {
          await hmsActions.attachVideo(hmsVideoTrack.id, videoRef.current);
        } else {
          await hmsActions.removeVideo(hmsVideoTrack.id, videoRef.current);
        }
      }
    })();
  }, [inView, videoRef, videoTrack, hmsVideoTrack]);

  useEffect(() => {
    if (videoRef && videoRef.current && videoTrack && !hmsVideoTrack) {
      videoRef.current.srcObject = new MediaStream([videoTrack]);
    }
  }, [videoRef, videoTrack, isLocal]);

  return (
    <>
      <video
        ref={setRefs}
        muted={true}
        autoPlay
        playsInline
        className={`${styler('video')} 
          ${displayShape === 'circle' ? styler('videoCircle') : ''}
          ${
            isLocal && hmsVideoTrack?.source === 'regular'
              ? styler('videoLocal')
              : ''
          }
          ${objectFit === 'contain' ? styler('videoContain') : ''}
          ${objectFit === 'cover' ? styler('videoCover') : ''}
        `}
      ></video>
      {showAudioLevel && audioLevelDisplayType === 'border' && (
        <AudioLevelIndicator
          peerId={peerId}
          type={'border'}
          level={audioLevel}
          displayShape={displayShape}
          classes={{
            videoCircle: styler('videoCircle'),
            root: styler('borderAudioRoot'),
          }}
          color={audioLevelDisplayColor}
        />
      )}
    </>
  );
};
