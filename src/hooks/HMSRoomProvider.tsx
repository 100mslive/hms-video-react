import { HMSSdk, HMSPeerUpdate } from '@100mslive/100ms-web-sdk';
import HMSConfig from '@100mslive/100ms-web-sdk/dist/interfaces/config';
import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import HMSUpdateListener from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import HMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';
import React, { createContext, useContext, useState } from 'react';
import HMSLogger from '../utils/ui-logger';
import sdkEventEmitter from './helpers/event-emitter';
import { MessageProvider } from './MessageProvider';
import { SpeakerProvider } from './SpeakerProvider';

interface ScreenShareStatus {
  isScreenShared: boolean;
  peer: HMSPeer | null;
  track: HMSTrack | null;
}

interface HMSRoomProviderProps {
  sdk: HMSSdk;
  peers: HMSPeer[];
  localPeer: HMSPeer | null;
  audioMuted: boolean;
  videoMuted: boolean;
  join: (config: HMSConfig, listener: HMSUpdateListener) => void;
  leave: () => void;
  isPeerMuted: (type: 'audio' | 'video', peer?: HMSPeer) => boolean;
  toggleMute: (type: 'audio' | 'video') => void;
  toggleScreenShare: () => void;
  getScreenShareStatus: () => ScreenShareStatus;
}

const sdk = new HMSSdk();

const HMSContext = createContext<HMSRoomProviderProps | null>(null);

export const HMSRoomProvider: React.FC = props => {
  const [peers, setPeers] = useState<HMSPeer[]>([]);
  const [localPeer, setLocalPeer] = useState<HMSPeer | null>(null);

  const join = (config: HMSConfig, listener: HMSUpdateListener) => {
    sdk.join(config, {
      onJoin: room => {
        setLocalPeerAndPeers();
        listener.onJoin(room);
      },
      onRoomUpdate: (type, room) => {
        listener.onRoomUpdate(type, room);
      },
      onPeerUpdate: (type, peer) => {
        HMSLogger.d('Listener [onPeerUpdate]: ', type, peer);
        handlePeerUpdate(type, peer);
        sdkEventEmitter.emit('peer-update', type, peer);
        listener.onPeerUpdate(type, peer);
      },
      onTrackUpdate: (type, track, peer) => {
        HMSLogger.d('Listener [onTrackUpdate]: ', type, track, peer);
        setLocalPeerAndPeers();
        listener.onTrackUpdate(type, track, peer);
      },
      onMessageReceived: message => {
        HMSLogger.d('Listener [onMessageReceived]: ', message);
        sdkEventEmitter.emit('message-received', message);
        listener.onMessageReceived(message);
      },
      onError: exception => {
        listener.onError(exception);
      },
    });

    sdk.addAudioListener({
      onAudioLevelUpdate: speakers => {
        sdkEventEmitter.emit('audio-level-update', speakers);
      },
    });
  };

  const setLocalPeerAndPeers = () => {
    setPeers(sdk.getPeers());
    setLocalPeer(sdk.getLocalPeer());
  };

  const handlePeerUpdate = (type: HMSPeerUpdate, _peer: HMSPeer | null) => {
    if (
      !(
        type === HMSPeerUpdate.BECAME_DOMINANT_SPEAKER ||
        type === HMSPeerUpdate.RESIGNED_DOMINANT_SPEAKER
      )
    ) {
      setLocalPeerAndPeers();
    }
  };

  /**
   * Checks the audio/video mute status of the peer given or local peer if not given.
   * @param type Mute status of audio track or video track.
   * @param peer Peer to check the mute status. LocalPeer is checked if undefined.
   */
  const isPeerMuted = (type: 'audio' | 'video', peer?: HMSPeer) => {
    const checkPeer = peer
      ? peers.find(peerObj => peer.peerId === peerObj.peerId)
      : localPeer;

    if (type === 'audio') {
      return Boolean(checkPeer?.audioTrack?.enabled);
    } else {
      return Boolean(checkPeer?.videoTrack?.enabled);
    }
  };

  const toggleMute = async (type: 'audio' | 'video') => {
    if (localPeer && localPeer.audioTrack && type === 'audio') {
      HMSLogger.d('toggleMute: before', localPeer.audioTrack.enabled);
      await localPeer.audioTrack.setEnabled(!localPeer.audioTrack.enabled);
      HMSLogger.d('toggleMute: after', localPeer.audioTrack.enabled);
    }
    if (localPeer && localPeer.videoTrack && type === 'video') {
      HMSLogger.d('toggleMute: before', localPeer.videoTrack.enabled);
      await localPeer.videoTrack.setEnabled(!localPeer.videoTrack.enabled);
      HMSLogger.d('toggleMute: after', localPeer.videoTrack.enabled);
    }

    setLocalPeer(localPeer);
  };

  const hasPeerScreenShared = (peer: HMSPeer | undefined | null) => {
    return Boolean(
      peer &&
        peer.auxiliaryTracks.length > 0 &&
        peer.auxiliaryTracks.some(
          track => track.type === 'video' && track.source === 'screen',
        ),
    );
  };

  const toggleScreenShare = async () => {
    const isLocalScreenShared = hasPeerScreenShared(localPeer);
    if (!isLocalScreenShared) {
      await sdk.startScreenShare(() => {
        setLocalPeerAndPeers();
      });
    } else {
      await sdk.stopScreenShare();
    }

    setLocalPeerAndPeers();
  };

  const getScreenShareStatus = (): ScreenShareStatus => {
    const screenSharePeer = peers.find(hasPeerScreenShared);
    if (screenSharePeer) {
      return {
        isScreenShared: true,
        peer: screenSharePeer,
        track:
          screenSharePeer.auxiliaryTracks.find(
            track => track.type === 'video' && track.source === 'screen',
          ) || null,
      };
    } else {
      return {
        isScreenShared: false,
        peer: null,
        track: null,
      };
    }
  };

  const leave = () => sdk.leave();

  window.onunload = () => {
    leave();
  };

  return (
    <HMSContext.Provider
      value={{
        sdk,
        localPeer,
        peers,
        audioMuted: localPeer?.audioTrack?.enabled as boolean,
        videoMuted: localPeer?.audioTrack?.enabled as boolean,
        join,
        leave,
        isPeerMuted,
        toggleMute,
        toggleScreenShare,
        getScreenShareStatus,
      }}
    >
      <MessageProvider>
        <SpeakerProvider>{props.children}</SpeakerProvider>
      </MessageProvider>
    </HMSContext.Provider>
  );
};

export const useHMSRoom = (): HMSRoomProviderProps => {
  const HMSContextConsumer = useContext(HMSContext);

  if (HMSContextConsumer === null) {
    throw new Error('HMSContext state variables are not set');
  }

  return HMSContextConsumer;
};
