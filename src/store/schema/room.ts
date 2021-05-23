import { HMSPeerID } from './peer';

export type HMSRoomID = string;

export interface HMSRoom {
  id: HMSRoomID;
  name: string;
  isConnected?: boolean;
  peers: HMSPeerID[];
  shareableLink: string;
  hasWaitingRoom: boolean;
}

export enum HMSRoomUpdate {
  PEER_ADDED,
  PEER_REMOVED,
  PEER_KNOCKED,
  ROOM_TYPE_CHANGED,
  METADATA_UPDATED,
  SCREENSHARE_STARTED,
  SCREENSHARE_STOPPED,
  DEFAULT_UPDATE,
}