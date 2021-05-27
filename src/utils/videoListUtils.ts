import { HMSPeer, HMSTrack, HMSTrackID } from '../store/schema';

export type TrackWithPeer = { track: HMSTrack; peer: HMSPeer };

export const getVideoTracksFromPeers = (
  peers: HMSPeer[],
  tracks: Record<HMSTrackID, HMSTrack>,
  showScreenFn: (peer: HMSPeer) => boolean,
) => {
  if (!peers || !tracks || !showScreenFn) {
    return [];
  }
  const videoTracks: TrackWithPeer[] = [];
  for (let peer of peers) {
    if (peer.videoTrack && tracks[peer.videoTrack]) {
      videoTracks.push({ track: tracks[peer.videoTrack], peer: peer });
    }
    if (showScreenFn(peer) && peer.auxiliaryTracks.length > 0) {
      const screenShareTrackID = peer.auxiliaryTracks[0];
      if (tracks[screenShareTrackID]) {
        videoTracks.push({ track: tracks[screenShareTrackID], peer: peer });
      }
    }
  }
  return videoTracks;
};
