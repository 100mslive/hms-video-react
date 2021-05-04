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
      const peers = sdk.getPeers();
      console.debug('HMSui-component: Listener [onJoin]', peers);
      setPeers(peers);
      setLocalPeer(sdk.getLocalPeer());
      incomingListener.onJoin(room);
    },

    onPeerUpdate: (type: HMSPeerUpdate, peer: HMSPeer) => {
      const peers = sdk.getPeers();
      console.debug(
        'HMSui-component: Listener [onPeerUpdate]',
        HMSPeerUpdate[type],
        peer,
        { peers },
      );

      setPeers(peers);
      setLocalPeer(sdk.getLocalPeer());
      if (type === HMSPeerUpdate.BECAME_DOMINANT_SPEAKER) {
        setDominantSpeaker(peer);
      }
      if (type === HMSPeerUpdate.RESIGNED_DOMINANT_SPEAKER) {
        setDominantSpeaker(null);
      }
      incomingListener.onPeerUpdate(type, peer);
    },

    onRoomUpdate: (type: HMSRoomUpdate, room: HMSRoom) => {
      console.debug(
        'HMSui-component: Listener [onRoomUpdate]',
        HMSRoomUpdate[type],
        room,
        { peers: sdk.getPeers() },
      );
      incomingListener.onRoomUpdate(type, room);
    },

    onTrackUpdate: (type: HMSTrackUpdate, track: HMSTrack, peer: HMSPeer) => {
      const peers = sdk.getPeers();
      console.debug(
        'HMSui-component: Listener [onTrackUpdate]',
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
      console.debug('HMSui-component: Listener [onError]', exception);
      incomingListener.onError(exception);
    },

    onMessageReceived: (message: HMSMessage) => {
      console.debug('HMSui-component: Listener [onMessageReceived] ', message);
      let senderPeer = sdk
        .getPeers()
        .find(peer => peer.peerId === message.sender);
      let localPeer = sdk.getLocalPeer();
      console.log(
        `HMSui-Component: Listener message received `,
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
