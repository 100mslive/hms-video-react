import { HMSPeer, HMSPeerID, HMSTrackID, HMSTrack } from './peer';
import { HMSMessage, HMSMessageID } from './message';
import { HMSRoom, HMSRoomID } from './room';

export interface HMSStore {
  rooms: {
    byID: Record<HMSRoomID, HMSRoom>,
    allIDs: HMSRoomID[]
  },
  peers: {
    byID: Record<HMSPeerID, HMSPeer>,
    allIDs: HMSPeerID[]
  },
  tracks: {
    byID: Record<HMSTrackID, HMSTrack>,
    allIDs: HMSTrackID[]
  },
  messages: {
    byID: Record<HMSMessageID, HMSMessage>,
    allIDs: HMSMessageID[]
  },
}
