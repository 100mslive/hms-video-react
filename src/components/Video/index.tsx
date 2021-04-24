import React, { useEffect, useRef } from 'react';
import { AudioLevelDisplayType } from '../../types';
import { AudioLevelIndicator } from '../AudioLevelIndicators';

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
   * Video Track to be displayed.
   */
  videoTrack: MediaStreamTrack;
  /**
   * Audio Track to be displayed.
   */
  audioTrack: MediaStreamTrack;
  /**
   * Indicates if the stream belongs to the user viewing it. Used in labelling and styling.
   */
  isLocal?: boolean;
  /**
   * Indicates if the stream is generated by a camera, a screen-share or captured from canvas(or other media elements).
   * Used only if the stream is a local stream
   */
  videoSource?: 'screen' | 'camera' | 'canvas';
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

  classes?: VideoClasses;
}

export const Video = ({
  videoTrack,
  audioTrack,
  objectFit,
  isLocal,
  videoSource,
  showAudioLevel,
  audioLevel = 0,
  audioLevelDisplayType,
  audioLevelDisplayColor,
  displayShape,
  classes = {
    video: 'h-full w-full rounded-lg',
    videoCircle: 'rounded-full',
    videoLocal: 'transform -scale-x-100',
    videoCover: 'object-cover',
    videoContain: 'object-contain',
    borderAudioRoot: 'w-full h-full absolute left-0 top-0 rounded-lg',
  },
}: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (videoRef && videoRef.current && videoTrack) {
      videoRef.current.srcObject = new MediaStream([videoTrack]);
    }
    if (audioRef && audioRef.current && audioTrack && !isLocal) {
      audioRef.current.srcObject = new MediaStream([audioTrack]);
    }
  }, [audioRef, videoRef, videoTrack, audioTrack, isLocal]);

  return (
    <>
      <video
        ref={videoRef}
        muted={true}
        autoPlay
        playsInline
        className={` ${classes.video} 
          ${displayShape === 'circle' ? classes.videoCircle : ''}
          ${isLocal && videoSource === 'camera' ? classes.videoLocal : ''}
          ${objectFit === 'contain' ? classes.videoContain : ''}
          ${objectFit === 'cover' ? classes.videoCover : ''}
        `}
      ></video>
      <audio className="hidden" autoPlay playsInline ref={audioRef}></audio>
      {showAudioLevel && audioLevelDisplayType === 'border' && (
        <AudioLevelIndicator
          type={'border'}
          level={audioLevel}
          displayShape={displayShape}
          classes={{
            videoCircle: classes.videoCircle,
            root: classes.borderAudioRoot,
          }}
          color={audioLevelDisplayColor}
        />
      )}
    </>
  );
};
