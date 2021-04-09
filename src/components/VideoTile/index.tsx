import React, { useEffect, useRef, useState } from 'react';
import { AudioLevelDisplayType, Peer } from '../../types';
import './index.css';
import BottomControls from './BottomControls';
import { Avatar } from '../Avatar';

export interface VideoTileProps {
  /**
    MediaStream to be displayed.
    */
  stream: MediaStream;
  /**
    HMS Peer object for which the tile is shown.
    */
  peer: Peer;
  /**
    Additional classnames to be applied.
    */
  className: string;
  /**
    Indiactes if the stream is local or not.
    */
  isLocal?: boolean;
  /**
   Used to display label for video tile.
    */
  videoSource: 'screen' | 'camera' | 'canvas';
  /**
    Used for displaying audioLevel of the videoTile, when showAudioLevel prop is true.
    */
  audioLevel?: number;
  /**
   Indicates if Audio is Muted or not.
   */
  isAudioMuted?: boolean;
  /**
   Indicates if Video is Muted or not.
   */
  isVideoMuted?: boolean;
  /**
   Indicates if video tile speaker is dominant or not.
   */
  isDominantSpeaker?: boolean;
  /**
   Indicates if dominant speaker will be shown or not.
   */
  showDominantSpeakerStatus?: boolean;
  /**
   Indicates if Audio Status will be shown or not.
   */
  showAudioMuteStatus: boolean;
  showVideoMuteStatus: 'always' | 'onmute';
  /**
   Indicates if Audio Lvele of tile will be shown or not.
   */
  showAudioLevel?: boolean;
  displayFit: 'contain' | 'cover';
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
  /**
   *Specifies if remote mute and umute of tile is allowed or not.
   */
  allowRemoteMute: boolean;
}

export const VideoTile = ({
  stream,
  peer,
  className = 'shadow-lg rounded-lg',
  isLocal = false,
  videoSource = 'camera',
  audioLevel,
  isAudioMuted = false,
  isVideoMuted,
  isDominantSpeaker,
  showAudioMuteStatus = true,
  showVideoMuteStatus = 'onmute',
  showDominantSpeakerStatus,
  showAudioLevel,
  displayFit = 'contain',
  aspectRatio = { width: 16, height: 9 },
  displayShape = 'rectangle',
  audioLevelDisplayType,
  allowRemoteMute = false,
}: VideoTileProps) => {
  const [height, setHeight] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isSquareOrCircle =
    (displayShape === 'rectangle' &&
      aspectRatio.width === aspectRatio.height) ||
    displayShape === 'circle';

  let label;
  let videoTileStyle: React.CSSProperties = {};
  let videoStyle: React.CSSProperties = { objectFit: 'cover' };

  useEffect(() => {
    const videoTile = videoRef.current?.parentElement;
    const parent = videoTile?.parentElement;
    const height = parent?.getBoundingClientRect().height as number;
    setHeight(height);
  }, [stream, aspectRatio, displayShape]);

  useEffect(() => {
    if (videoRef && videoRef.current && stream) {
      videoRef.current!.srcObject = stream;
    }
  }, [videoRef, stream]);

  if (isSquareOrCircle)
    videoTileStyle['width'] = videoStyle['width'] = height + 'px';
  else
    videoStyle['width'] =
      (aspectRatio.width / aspectRatio.height) * height + 'px';

  if (isLocal && videoSource === 'camera')
    videoStyle['transform'] = 'scale(-1, 1)';

  if (isLocal) {
    if (videoSource === 'screen') label = 'Your Screen';
    else label = 'You';
  } else {
    if (videoSource === 'screen') label = `${peer.displayName}'s Screen`;
    else label = peer.displayName;
  }

  if (showAudioLevel && audioLevel && audioLevelDisplayType === 'border')
    videoStyle['boxShadow'] = `0px 0px ${0.12 *
      audioLevel}px #0F6CFF, 0px 0px ${0.8 * audioLevel}px #0F6CFF`;

  return (
    <div
      className={`video-tile flex h-full relative items-center m-2`}
      style={videoTileStyle}
    >
      <video
        muted
        autoPlay
        className={`h-full ${className} ${
          displayShape === 'circle' ? 'rounded-full' : ''
        }`}
        ref={videoRef}
        style={videoStyle}
      ></video>
      {isVideoMuted && (
        <div className="absolute left-0 right-0 mx-auto text-center z-10">
          <Avatar label={peer.displayName} />
        </div>
      )}
      <div className="absolute bottom-0 w-full">
        <BottomControls
          label={label}
          isAudioMuted={isAudioMuted}
          showControls={allowRemoteMute || displayShape === 'circle'}
          showAudioMuteStatus={showAudioMuteStatus}
          showGradient={displayShape !== 'circle'}
          allowRemoteMute={allowRemoteMute}
          showAudioLevel={showAudioLevel}
          audioLevelDisplayType={audioLevelDisplayType}
          audioLevel={audioLevel}
          showAvatar={showVideoMuteStatus === 'always' && !isVideoMuted}
          avatar={<Avatar label={peer.displayName} height="30px" />}
        />
      </div>
    </div>
  );
};
