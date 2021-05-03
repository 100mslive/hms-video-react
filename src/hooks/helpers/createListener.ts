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
  incomingListener: HMSUpdateListener,
  setPeers: React.Dispatch<React.SetStateAction<HMSPeer[]>>,
  setLocalPeer: React.Dispatch<React.SetStateAction<HMSPeer>>,
  receiveMessage: (message: HMSMessage) => void,
  sdk: HMSSdk,
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
      console.debug(
        'HMSui-component: [onPeerUpdate] Inside listener, peers are',
        sdk.getPeers(),
      );

      setPeers(sdk.getPeers());
      setLocalPeer(sdk.getLocalPeer());
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
      let senderPeer = sdk
        .getPeers()
        .find(peer => peer.peerId == message.sender);
      let localPeer = sdk.getLocalPeer();
      console.log(
        `HMSui-Component: message received `,
        message,
        ` senderPeer`,
        senderPeer,
        ` localPeer`,
        localPeer,
        `peers`,
        sdk.getPeers(),
      );
      receiveMessage({
        ...message,
        sender:
          localPeer.peerId == message.sender
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
