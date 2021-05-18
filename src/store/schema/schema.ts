import { HMSPeer, HMSPeerID, HMSTrackID, HMSTrack } from './peer';
import { HMSMessage, HMSMessageID } from './message';
import { HMSRoom } from './room';

/*
Defines the schema of the central store. UI Components are aware of the presence
of this central store.
 */
export interface HMSStore {
  room: HMSRoom;
  peers: Record<HMSPeerID, HMSPeer>;
  tracks: Record<HMSTrackID, HMSTrack>;
  messages: {
    byID: Record<HMSMessageID, HMSMessage>;
    allIDs: HMSMessageID[];
  };
}
