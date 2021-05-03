import { HMSSdk } from '@100mslive/100ms-web-sdk';
import HMSException from '@100mslive/100ms-web-sdk/dist/error/HMSException';
import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import HMSMessage from '@100mslive/100ms-web-sdk/dist/interfaces/message';
import HMSRoom from '@100mslive/100ms-web-sdk/dist/interfaces/room';
import HMSUpdateListener, {
  HMSPeerUpdate,
  HMSRoomUpdate,
  HMSTrackUpdate,
} from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import HMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';

const createListener = (
  sdk: HMSSdk,
  incomingListener: HMSUpdateListener,
  setPeers: React.Dispatch<React.SetStateAction<HMSPeer[]>>,
  setLocalPeer: React.Dispatch<React.SetStateAction<HMSPeer>>,
  receiveMessage: (message: HMSMessage) => void,
  setDominantSpeaker: React.Dispatch<React.SetStateAction<HMSPeer | null>>,
) => {
  const myListener = {
    onJoin: (room: HMSRoom) => {
      console.debug(
        'HMSui-component: [onJoin] Inside listener, peers are',
        sdk.getPeers(),
      );

      setPeers(sdk.getPeers());
      setLocalPeer(sdk.getLocalPeer());

      incomingListener.onJoin(room);
    },

    onPeerUpdate: (type: HMSPeerUpdate, peer: HMSPeer) => {
      const peers = sdk.getPeers();
      console.debug(
        'HMSui-component: [onPeerUpdate] Inside listener',
        HMSPeerUpdate[type],
        peer,
        { peers },
      );

      setPeers(peers);
      setLocalPeer(sdk.getLocalPeer());
      if (type == HMSPeerUpdate.BECAME_DOMINANT_SPEAKER) {
        setDominantSpeaker(peer);
      }
      if (type == HMSPeerUpdate.RESIGNED_DOMINANT_SPEAKER) {
        setDominantSpeaker(null);
      }
      incomingListener.onPeerUpdate(type, peer);
    },

    onRoomUpdate: (type: HMSRoomUpdate, room: HMSRoom) => {
      console.debug(
        'HMSui-component: [onRoomUpdate] Inside listener, peers are',
        sdk.getPeers(),
      );
    },

    onTrackUpdate: (type: HMSTrackUpdate, track: HMSTrack, peer: HMSPeer) => {
      console.debug(
        'HMSui-component: [onTrackUpdate] Inside listener, peers and peer are',
        sdk.getPeers(),
        peer,
      );

      setPeers(sdk.getPeers());
      setLocalPeer(sdk.getLocalPeer());
      incomingListener.onTrackUpdate(type, track, peer);
    },

    onError: (exception: HMSException) => {
      console.debug('HMSui-component: [onError] Inside listener');

      incomingListener.onError(exception);
    },
    onMessageReceived: (message: HMSMessage) => {
      console.debug('HMSui-component: [onMessageReceived] ', message);
      receiveMessage(message);
    },
  };

  return myListener;
};

export default createListener;
