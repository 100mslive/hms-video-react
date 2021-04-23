import HMSConfig from '@nikhilghodke/100ms-web-sdk/dist/interfaces/config';
import HMSPeer from '@nikhilghodke/100ms-web-sdk/dist/interfaces/hms-peer';
import HMSMessage from '@nikhilghodke/100ms-web-sdk/dist/interfaces/message';
import HMSUpdateListener from '@nikhilghodke/100ms-web-sdk/dist/interfaces/update-listener';
import HMSTrack from '@nikhilghodke/100ms-web-sdk/dist/media/tracks/HMSTrack';

export default interface HMSRoomProps {
  peers: HMSPeer[];
  localPeer: HMSPeer;
  messages: HMSMessage[];
  join: (config: HMSConfig, listener: HMSUpdateListener) => void;
  leave: () => void;
  toggleMute: (track: HMSTrack) => void;
  toggleScreenShare: () => void;
  sendMessage: (message: string) => void;
}
