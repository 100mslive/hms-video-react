import React, { useEffect } from 'react';
import { Peer } from '../../types';
import './index.css';
import BottomControls from './BottomControls';

export interface VideoTileProps {
  stream?: MediaStream | string;
  peer: Peer;
  isLocal?: boolean;
  videoSource: 'camera' | 'landscape-video' | 'potrait-video' | 'stream';
  videoType?: 'screen' | 'camera' | 'canvas';
  audioLevel?: number;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  isDominantSpeaker?: boolean;
  showDominantSpeakerStatus?: boolean;
  showAudioMuteStatus?: boolean;
  showVideoMuteStatus?: boolean;
  showAudioLevel?: boolean;
  displayFit?: 'contain' | 'cover';
  aspectRatio?: [number, number];
  displayShape?: 'circle' | 'rectangle';
  audioLevelDisplayType?:
    | 'inline-wave'
    | 'inline-circle'
    | 'border'
    | 'avatar-circle';
}

export const VideoTile = ({
  stream,
  peer,
  isLocal = false,
  videoSource,
  audioLevel,
  isAudioMuted,
  isVideoMuted,
  isDominantSpeaker,
  showAudioMuteStatus,
  showVideoMuteStatus,
  showDominantSpeakerStatus,
  showAudioLevel,
  displayFit = 'contain',
  aspectRatio = [16, 9],
  displayShape = 'rectangle',
  audioLevelDisplayType,
}: VideoTileProps) => {
  let video: HTMLVideoElement;

  useEffect(() => {
    if (videoSource == 'camera')
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function(stream) {
          //video.src = window.URL.createObjectURL(stream);
          video.srcObject = stream;
        });
    else {
      let stream = video.srcObject;
      if (stream && stream instanceof MediaStream) {
        var tracks = stream.getTracks();
        for (var i = 0; i < tracks.length; i++) {
          var track = tracks[i];
          track.stop();
        }
        video.srcObject = null;
      }
    }
    if (videoSource == 'landscape-video') {
      video.srcObject = null;
      video.src = stream as string;
    } else if (videoSource == 'potrait-video') {
      video.srcObject = null;
      video.src = stream as string;
    } else if (videoSource == 'stream')
      if (stream instanceof MediaStream) video.srcObject = stream;
    video.play();
    console.log(videoSource), stream;
  }, [videoSource, stream]);

  return (
    <div className="video-tile inline-block h-full relative m-2">
      <video
        muted={isAudioMuted}
        autoPlay
        className="shadow-lg rounded-lg"
        ref={ref => {
          if (ref) video = ref;
        }}
      >
        <p>Your browser cannot play the provided video fileddd.</p>
      </video>
      <BottomControls peer={peer} isAudioMuted={isAudioMuted} />
    </div>
  );
};
