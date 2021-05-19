import { HMSStore, HMSTrack, HMSTrackID } from '../schema';
import { localPeerSelector, peerByIDSelector } from './peerSelectors';
import { createSelector } from 'reselect';

export const tracksMapSelector = (store: HMSStore) => store.tracks;
export const trackIDSelector = (store: HMSStore, trackID: HMSTrackID) =>
  trackID;

export const localAudioTrackIDSelector = createSelector(
  localPeerSelector,
  peer => peer.audioTrack,
);

export const localVideoTrackIDSelector = createSelector(
  localPeerSelector,
  peer => peer.videoTrack,
);

export const isLocalAudioEnabledSelector = (store: HMSStore) => {
  const localPeer = localPeerSelector(store);
  return isTrackEnabled(store, localPeer?.audioTrack);
};

export const isLocalVideoEnabledSelector = (store: HMSStore) => {
  const localPeer = localPeerSelector(store);
  return isTrackEnabled(store, localPeer?.videoTrack);
};

export const isPeerAudioEnabledSelector = (store: HMSStore, peerID: string) => {
  const peer = peerByIDSelector(store, peerID);
  return isTrackEnabled(store, peer?.audioTrack);
};

export const isPeerVideoEnabledSelector = (store: HMSStore, peerID: string) => {
  const peer = peerByIDSelector(store, peerID);
  return isTrackEnabled(store, peer?.videoTrack);
};

export const isLocalScreenSharedSelector = (store: HMSStore): boolean => {
  const localPeer = localPeerSelector(store);
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
