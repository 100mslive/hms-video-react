import { HMSPeer, HMSPeerID, HMSTrackID, HMSTrack } from './peer';
import { HMSMessage, HMSMessageID } from './message';

export interface HMSStore {
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
  }
}
