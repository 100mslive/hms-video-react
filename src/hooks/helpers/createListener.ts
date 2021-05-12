import { HMSSdk, HMSTrackType } from '@100mslive/100ms-web-sdk';
import HMSException from '@100mslive/100ms-web-sdk/dist/error/HMSException';
import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import HMSMessage from '@100mslive/100ms-web-sdk/dist/interfaces/message';
import HMSRoom from '@100mslive/100ms-web-sdk/dist/interfaces/room';
import HMSUpdateListener from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import {
  HMSPeerUpdate,
  HMSRoomUpdate,
  HMSTrackUpdate,
} from '@100mslive/100ms-web-sdk';
import HMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';
import HMSLogger from '../../utils/ui-logger';

const createListener = (
  sdk: HMSSdk,
  incomingListener: HMSUpdateListener,
  setPeers: React.Dispatch<React.SetStateAction<HMSPeer[]>>,
  setLocalPeer: React.Dispatch<React.SetStateAction<HMSPeer>>,
  receiveMessage: (message: HMSMessage) => void,
  updateDominantSpeaker: (type: HMSPeerUpdate, peer: HMSPeer | null) => void,
) => {
  const myListener = {
    onJoin: (room: HMSRoom) => {
      const peers = sdk.getPeers();
      HMSLogger.d('Listener [onJoin]', peers);
      setPeers(peers);
      setLocalPeer(sdk.getLocalPeer());
      incomingListener.onJoin(room);
    },

    onPeerUpdate: (type: HMSPeerUpdate, peer: HMSPeer | null) => {
      const peers = sdk.getPeers();
      HMSLogger.d('Listener [onPeerUpdate]', HMSPeerUpdate[type], peer, {
        peers,
      });

      setPeers(peers);
      setLocalPeer(sdk.getLocalPeer());
      updateDominantSpeaker(type, peer);
      incomingListener.onPeerUpdate(type, peer);
    },

    onRoomUpdate: (type: HMSRoomUpdate, room: HMSRoom) => {
      HMSLogger.d('Listener [onRoomUpdate]', HMSRoomUpdate[type], room);
      incomingListener.onRoomUpdate(type, room);
    },

    onTrackUpdate: (type: HMSTrackUpdate, track: HMSTrack, peer: HMSPeer) => {
      const peers = sdk.getPeers();
      HMSLogger.d(
        'Listener [onTrackUpdate]',
        HMSTrackUpdate[type],
        track,
        peer,
        { peers },
      );
      setPeers(peers);
      setLocalPeer(sdk.getLocalPeer());
      incomingListener.onTrackUpdate(type, track, peer);
    },

    onError: (exception: HMSException) => {
      HMSLogger.d('Listener [onError]', exception);
      incomingListener.onError(exception);
    },

    onMessageReceived: (message: HMSMessage) => {
      HMSLogger.d('Listener [onMessageReceived] ', message);
      let senderPeer = sdk
        .getPeers()
        .find(peer => peer.peerId === message.sender);
      let localPeer = sdk.getLocalPeer();
      receiveMessage({
        ...message,
        sender:
          localPeer.peerId === message.sender
            ? 'You'
            : senderPeer
            ? senderPeer.name
            : 'Unknown',
      });
    },
  };

  return myListener;
};

export default createListener;
