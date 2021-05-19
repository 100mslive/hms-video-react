import { HMSStore, HMSTrack, HMSTrackID } from '../schema';
import { selectLocalPeer, selectPeerByID } from './peerSelectors';
import { createSelector } from 'reselect';

export const selectTracksMap = (store: HMSStore) => store.tracks;
export const trackIDSelector = (store: HMSStore, trackID: HMSTrackID) =>
  trackID;

export const selectLocalAudioTrackID = createSelector(
  selectLocalPeer,
  peer => peer.audioTrack,
);

export const selectLocalVideoTrackID = createSelector(
  selectLocalPeer,
  peer => peer.videoTrack,
);

export const selectIsLocalAudioEnabled = (store: HMSStore) => {
  const localPeer = selectLocalPeer(store);
  return isTrackEnabled(store, localPeer?.audioTrack);
};

export const selectIsLocalVideoEnabled = (store: HMSStore) => {
  const localPeer = selectLocalPeer(store);
  return isTrackEnabled(store, localPeer?.videoTrack);
};

export const selectIsPeerAudioEnabled = (store: HMSStore, peerID: string) => {
  const peer = selectPeerByID(store, peerID);
  return isTrackEnabled(store, peer?.audioTrack);
};

export const selectIsPeerVideoEnabled = (store: HMSStore, peerID: string) => {
  const peer = selectPeerByID(store, peerID);
  return isTrackEnabled(store, peer?.videoTrack);
};

export const selectIsLocalScreenShared = (store: HMSStore): boolean => {
  const localPeer = selectLocalPeer(store);
  return localPeer.auxiliaryTracks.some(trackID => {
    return isScreenShare(store.tracks[trackID]);
  });
};

function isScreenShare(track: HMSTrack) {
  return track.type === 'video' && track.source === 'screen';
}

function isTrackEnabled(store: HMSStore, trackID?: string) {
  if (trackID && store.tracks[trackID]) {
    return store.tracks[trackID].enabled;
  }
  return false;
}
