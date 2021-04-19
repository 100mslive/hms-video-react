import HMSConfig from "@100mslive/100ms-web-sdk/dist/interfaces/config";
import HMSPeer from "@100mslive/100ms-web-sdk/dist/interfaces/hms-peer";
import HMSUpdateListener from "@100mslive/100ms-web-sdk/dist/interfaces/update-listener";
import HMSTrack from "@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack";

export default interface HMSRoomProps {
    peers: HMSPeer[];
    localPeer: HMSPeer;
    join: (config: HMSConfig, listener: HMSUpdateListener) => void;
    leave: () => void;
    toggleMute: (track: HMSTrack) => void;
};