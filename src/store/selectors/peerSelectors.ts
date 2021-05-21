import { HMSPeer, HMSPeerID, HMSRoom, HMSStore } from '../schema';
import { createSelector } from 'reselect';

const selectRoom = (store: HMSStore): HMSRoom => store.room;
export const selectPeersMap = (store: HMSStore): Record<HMSPeerID, HMSPeer> => store.peers;
const selectPeerID = (store: HMSStore, peerID: HMSPeerID | undefined) => peerID;

const selectSpeakerByID = (store: HMSStore, peerID: HMSPeerID | undefined) => {
  return peerID ? store.speakers[peerID] : null;
};

export const selectIsConnectedToRoom = createSelector(
  [selectRoom],
  (room) => room && room.isConnected
)

export const selectPeers = createSelector(
  [selectRoom, selectPeersMap],
  (room, storePeers) => {
    return room.peers.map(peerID => storePeers[peerID]);
  },
);

export const selectLocalPeer = createSelector(selectPeers, peers => {
  return peers.filter(p => p.isLocal)[0];
});

export const selectLocalPeerID = createSelector(selectLocalPeer, peer => {
  return peer.id;
});

export const selectRemotePeers = createSelector(selectPeers, peers => {
  return peers.filter(p => !p.isLocal);
});

export const selectDominantPeer = createSelector(selectPeers, peers => {
  const dominantSpeakers = peers.filter(p => p.isDominantSpeaker);
  if (dominantSpeakers.length > 0) {
    return dominantSpeakers[0].name;
  } else {
    return null;
  }
});

export const selectPeerByID = createSelector(
  [selectPeersMap, selectPeerID],
  (storePeers, peerID) => (peerID ? storePeers[peerID] : null),
);

export const selectPeerNameByID = createSelector(
  selectPeerByID,
  peer => peer?.name,
);

export const selectPeerAudioByID = createSelector(
  selectSpeakerByID,
  speaker => speaker?.audioLevel || 0,
);
