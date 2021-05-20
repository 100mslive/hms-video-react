import { HMSTrack } from './store/schema';

export interface Peer {
  id: string;
  displayName: string;
  role?: string;
  isLocal?: boolean;
}

export type VideoSource = 'screen' | 'camera' | 'canvas';

//TODO match with HMSPeer interface
export interface MediaStreamWithInfo {
  videoTrack: MediaStreamTrack;
  audioTrack: MediaStreamTrack;
  hmsVideoTrack?: HMSTrack;
  peer: Peer;
  videoSource: VideoSource;
}
export type AudioLevelDisplayType = 'inline-wave' | 'inline-circle' | 'border';

export type ButtonDisplayType = 'circle' | 'rectangle';

export interface Participant {
  peer: Peer;
  isAudioMuted?: boolean;
  isStarMarked?: boolean;
}
