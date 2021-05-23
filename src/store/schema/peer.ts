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
  isDominantSpeaker?: boolean;
  videoTrack?: HMSTrackID;
  audioTrack?: HMSTrackID;
  auxiliaryTracks: HMSTrackID[];
}

export interface HMSTrack {
  id: HMSTrackID;
  source?: HMSTrackSource;
  type: HMSTrackType;
  enabled: boolean;
}

// HMS Speaker is separated as it could have high frequency updates
export interface HMSSpeaker {
  id: HMSPeerID;
  audioLevel?: number;
}

export enum HMSPeerUpdate {
  PEER_JOINED,
  PEER_LEFT,
  AUDIO_TOGGLED,
  VIDEO_TOGGLED,
  BECAME_DOMINANT_SPEAKER,
  RESIGNED_DOMINANT_SPEAKER,
  STARTED_SPEAKING,
  STOPPED_SPEAKING,
}

export enum HMSTrackUpdate {
  TRACK_ADDED,
  TRACK_REMOVED,
  TRACK_MUTED,
  TRACK_UNMUTED,
  TRACK_DESCRIPTION_CHANGED,
}
