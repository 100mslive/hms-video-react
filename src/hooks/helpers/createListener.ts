import { HMSSdk } from '@100mslive/100ms-web-sdk';
import HMSException from '@100mslive/100ms-web-sdk/dist/error/HMSException';
import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import HMSRoom from '@100mslive/100ms-web-sdk/dist/interfaces/room';
import HMSUpdateListener, {
  HMSPeerUpdate,
  HMSRoomUpdate,
  HMSTrackUpdate,
} from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import HMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';

const createListener = (
  incomingListener: HMSUpdateListener,
  setPeers: React.Dispatch<React.SetStateAction<HMSPeer[]>>,
  setLocalPeer: React.Dispatch<React.SetStateAction<HMSPeer>>,
  sdk: HMSSdk,
) => {
  const myListener = {
    onJoin: (room: HMSRoom) => {
      console.debug('HMSui-component: [onJoin] Inside listener');

      setPeers(sdk.getPeers());
      setLocalPeer(sdk.getLocalPeer());
      incomingListener.onJoin(room);
    },

    onPeerUpdate: (type: HMSPeerUpdate, peer: HMSPeer) => {
      console.debug('HMSui-component: [onPeerUpdate] Inside listener');

      setPeers(sdk.getPeers());
      setLocalPeer(sdk.getLocalPeer());
      incomingListener.onPeerUpdate(type, peer);
    },

    onRoomUpdate: (type: HMSRoomUpdate, room: HMSRoom) => {
      console.debug('HMSui-component: [onRoomUpdate] Inside listener');
    },

    onTrackUpdate: (type: HMSTrackUpdate, track: HMSTrack, peer: HMSPeer) => {
      console.debug('HMSui-component: [onTrackUpdate] Inside listener');

      setPeers(sdk.getPeers());
      setLocalPeer(sdk.getLocalPeer());
      incomingListener.onTrackUpdate(type, track, peer);
    },

    onError: (exception: HMSException) => {
      console.debug('HMSui-component: [onError] Inside listener');

      incomingListener.onError(exception);
    },
  };

  return myListener;
};

export default createListener;
