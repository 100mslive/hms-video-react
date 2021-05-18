import { HMSStore } from '../schema';
import { createSelector } from 'reselect'

export const peersStoreSelector = (store: HMSStore) => store.peers;

export const peersSelector = createSelector(
  peersStoreSelector,
  (storePeers) => {
    return storePeers.allIDs.map((peerID) => storePeers.byID[peerID])
  }
)

export const localPeerSelector = createSelector(
  peersSelector,
  (peers) => {
    peers.filter(p => p.isLocal)[0];
  }
)

export const remotePeersSelector = createSelector(
  peersSelector,
  (peers) => {
    peers.filter(p => !p.isLocal)[0];
  }
)
