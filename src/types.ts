import HMSVideoTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSVideoTrack';

export interface Peer {
  id: string;
  displayName: string;
  role?: string;
}

export type VideoSource = 'screen' | 'camera' | 'canvas';

//TODO match with HMSPeer interface
export interface MediaStreamWithInfo {
  videoTrack: MediaStreamTrack;
  hmsVideoTrack?: HMSVideoTrack;
  audioTrack: MediaStreamTrack;
  peer: Peer;
  audioLevel?: number;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
  isLocal?: boolean;
  videoSource: VideoSource;
}
export type AudioLevelDisplayType = 'inline-wave' | 'inline-circle' | 'border';

export type ButtonDisplayType = 'circle' | 'rectangle';

export interface Participant {
  peer: Peer;
  isAudioMuted?: boolean;
  isStarMarked?: boolean;
}
