export interface Peer {
  id: string;
  displayName: string;
}

export type AudioLevelDisplayType =
  | 'inline-wave'
  | 'inline-circle'
  | 'border'
  | 'avatar-circle';

export type VideoSource = 'screen' | 'camera';

export interface MediaStreamWithInfo {
  stream: MediaStream;
  peer: Peer;
  audioLevel?: number;
  audioMuteStatus?: boolean;
  videoMuteStatus?: boolean;
  isLocal?: boolean;
  videoSource?: VideoSource;
}
