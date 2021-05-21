import { HMSPeer, HMSPeerID, HMSTrackID, HMSTrack, HMSSpeaker } from './peer';
import { HMSMessage, HMSMessageID } from './message';
import { HMSRoom } from './room';
import { HMSMediaSettings } from './settings';

/*
Defines the schema of the central store. UI Components are aware of the presence
of this central store. This is the global state - the single source of immutable truth.
 */
export interface HMSStore {
  room: HMSRoom;
  peers: Record<HMSPeerID, HMSPeer>;
  speakers: Record<HMSPeerID, HMSSpeaker>;
  tracks: Record<HMSTrackID, HMSTrack>;
  messages: {
    byID: Record<HMSMessageID, HMSMessage>;
    allIDs: HMSMessageID[];
  };
  settings: HMSMediaSettings;
}
