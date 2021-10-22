import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { AudioLevelDisplayType } from '../../types';
import { useInView } from 'react-intersection-observer';
import HMSLogger from '../../utils/ui-logger';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { useHMSActions, useHMSStore } from '../../hooks/HMSRoomProvider';
import {
  HMSTrack,
  HMSTrackID,
  selectTrackByID,
} from '@100mslive/hms-video-store';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';

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
  hmsVideoTrackId?: HMSTrackID;

  /**
   * @deprecated will be removed in near future
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
  audioTrackId?: string;
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
  videoTrack,
  hmsVideoTrackId,
  hmsVideoTrack,
  objectFit,
  isLocal,
  displayShape,
  classes,
}: VideoProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<VideoClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-video',
      }),
    [],
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hmsStoreVideoTrack = useHMSStore(
    selectTrackByID(hmsVideoTrackId || hmsVideoTrack?.id),
  );

  const hmsActions = useHMSActions();

  const { ref: inViewRef, inView } = useInView({ threshold: 0.5 });

  const setRefs = useCallback(
    node => {
      videoRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useEffect(() => {
    (async () => {
      if (videoRef.current && hmsStoreVideoTrack) {
        HMSLogger.d('Video InView', hmsStoreVideoTrack, inView);
        if (inView) {
          if (hmsStoreVideoTrack.enabled) {
            // attach when in view and enabled
            await hmsActions.attachVideo(
              hmsStoreVideoTrack.id,
              videoRef.current,
            );
          } else {
            // detach when in view but not enabled
            await hmsActions.detachVideo(
              hmsStoreVideoTrack.id,
              videoRef.current,
            );
          }
        } else {
          // detach when not in view
          await hmsActions.detachVideo(hmsStoreVideoTrack.id, videoRef.current);
        }
      }
    })();
  }, [
    inView,
    videoRef,
    hmsStoreVideoTrack?.id,
    hmsStoreVideoTrack?.enabled,
    hmsStoreVideoTrack?.deviceID,
    hmsStoreVideoTrack?.plugins,
  ]);

  useEffect(() => {
    if (videoRef && videoRef.current && videoTrack && !hmsStoreVideoTrack) {
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
            isLocal && (hmsStoreVideoTrack?.source === 'regular' || videoTrack)
              ? styler('videoLocal')
              : ''
          }
          ${objectFit === 'contain' ? styler('videoContain') : ''}
          ${objectFit === 'cover' ? styler('videoCover') : ''}
        `}
      ></video>
    </>
  );
};
