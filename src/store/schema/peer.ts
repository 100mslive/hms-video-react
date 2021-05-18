export type HMSPeerID = string;
export type HMSTrackID = string;
export type HMSTrackSource = 'regular' | 'screen' | 'plugin';
export type HMSTrackType = 'audio' | 'video';

export interface HMSPeer {
  id: HMSPeerID;
  name: string;
  role?: string;
  isLocal: boolean;
  isStarred?: boolean;
  audioLevel: number;
  videoTrack?: HMSTrackID;
  audioTrack?: HMSTrackID;
  auxiliaryTracks: HMSTrackID[];
}

export interface HMSTrack {
  id: HMSTrackID;
  source?: HMSTrackSource;
  type: HMSTrackType;
  muted: boolean;
}
