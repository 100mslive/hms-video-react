import { HMSPeer, HMSTrack, HMSTrackID } from '@100mslive/hms-video-store';

export type TrackWithPeer = { track?: HMSTrack; peer: HMSPeer };

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
    if (
      peer.videoTrack === undefined &&
      peer.audioTrack &&
      tracks[peer.audioTrack]
    ) {
      videoTracks.push({ peer: peer });
    } else if (peer.videoTrack && tracks[peer.videoTrack]) {
      videoTracks.push({ track: tracks[peer.videoTrack], peer: peer });
    }
    if (showScreenFn(peer) && peer.auxiliaryTracks.length > 0) {
      const screenShareTrackID = peer.auxiliaryTracks.find(trackID => {
        const track = tracks[trackID];
        return track.type === 'video' && track.source === 'screen';
      });

      // Don't show tile if screenshare only has audio
      if (screenShareTrackID) {
        videoTracks.push({ track: tracks[screenShareTrackID], peer: peer });
      }
    }
    if (peer.auxiliaryTracks.length > 0) {
      const videoPlaylistID = peer.auxiliaryTracks.find(trackID => {
        const track = tracks[trackID];
        return track.type === 'video' && track.source === 'playlist';
      });
      if (videoPlaylistID) {
        videoTracks.push({ track: tracks[videoPlaylistID], peer: peer });
      }
    }
  }
  return videoTracks;
};
