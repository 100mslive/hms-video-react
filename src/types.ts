export interface Peer {
  id: string;
  displayName: string;
}

export type VideoSource = 'screen' | 'camera' | 'canvas';

export interface MediaStreamWithInfo {
  stream: MediaStream;
  peer: Peer;
  audioLevel?: number;
  audioMuteStatus?: boolean;
  videoMuteStatus?: boolean;
  isLocal?: boolean;
  videoSource: VideoSource;
}
export type AudioLevelDisplayType = 'inline-wave' | 'inline-circle' | 'border';
