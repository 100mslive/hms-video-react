import { HMSPeerID, HMSStore, HMSTrack } from '../schema';
import { createSelector } from 'reselect';

const roomSelector = (store: HMSStore) => store.room;
export const peersMapSelector = (store: HMSStore) => store.peers;
const peerIDSelector = (store: HMSStore, peerID: HMSPeerID) => peerID;

export const peersSelector = createSelector(
  [roomSelector, peersMapSelector],
  (room, storePeers) => {
    return room.peers.map(peerID => storePeers[peerID]);
  },
);

export const localPeerSelector = createSelector(peersSelector, peers => {
  return peers.filter(p => p.isLocal)[0];
});

export const localPeerIDSelector = createSelector(localPeerSelector, peer => {
  return peer.id;
});

export const remotePeersSelector = createSelector(peersSelector, peers => {
  return peers.filter(p => !p.isLocal);
});

export const isLocalScreenSharedSelector = (store: HMSStore): boolean => {
  const localPeer = localPeerSelector(store);
  return localPeer.auxiliaryTracks.some(trackID => {
    return isScreenShare(store.tracks[trackID]);
  });
};

export const dominantPeerSelector = createSelector(peersSelector, peers => {
  const dominantSpeakers = peers.filter(p => p.isDominantSpeaker);
  if (dominantSpeakers.length > 0) {
    return dominantSpeakers[0].name;
  } else {
    return null;
  }
});

export const peerByIDSelector = createSelector(
  [peersMapSelector, peerIDSelector],
  (storePeers, peerID) => storePeers[peerID],
);

export const peerNameByIDSelector = createSelector(
  peerByIDSelector,
  peer => peer.name,
);

function isScreenShare(track: HMSTrack) {
  return track.type === 'video' && track.source === 'screen';
}
