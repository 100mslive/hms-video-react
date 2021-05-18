import { HMSMessage, HMSMessageType, HMSPeer, HMSPeerID, HMSStore, HMSTrack, HMSTrackID } from '../schema';
import { HMSSdk } from '@100mslive/100ms-web-sdk/dist';
import { UseStore } from 'zustand';
import IHMSBridge from '../IHMSBridge';
import * as sdkTypes from './sdkTypes';
import { SDKToHMS } from './adapter';
import {
  isLocalAudioEnabledSelector,
  isLocalScreenSharedSelector, isLocalVideoEnabledSelector,
  localAudioTrackIDSelector,
  localVideoTrackIDSelector,
  messagesCountSelector,
  peerNameByIDSelector,
  peersMapSelector,
  tracksMapSelector,
} from '../selectors';
import HMSLogger from '../../utils/ui-logger';

export default class HMSSDKBridge implements IHMSBridge {
  private hmsSDKTracks: Record<string, sdkTypes.HMSTrack> = {};
  private readonly sdk: HMSSdk;
  private readonly store: UseStore<HMSStore>;

  constructor(sdk: HMSSdk, store: UseStore<HMSStore>) {
    this.sdk = sdk;
    this.store = store;
  }

  join(config: sdkTypes.HMSConfig) {
    this.sdk.join(config, {
      onJoin: this.onJoin.bind(this),
      onRoomUpdate: this.onRoomUpdate.bind(this),
      onPeerUpdate: this.onPeerUpdate.bind(this),
      onTrackUpdate: this.onTrackUpdate.bind(this),
      onMessageReceived: this.onMessageReceived.bind(this),
      onError: this.onError.bind(this),
    });
    this.sdk.addAudioListener({
      onAudioLevelUpdate: this.onAudioLevelUpdate.bind(this)
    });
  }

  leave(): void {
    this.sdk.leave().then(() => {
      HMSLogger.i("sdk", "left room");
      this.store.destroy();
    });
  }

  async toggleScreenShare() {
    const isScreenShared = this.store(isLocalScreenSharedSelector);
    if (!isScreenShared) {
      await this.sdk.startScreenShare(this.syncPeers.bind(this));
    } else {
      await this.sdk.stopScreenShare();
    }
    this.syncPeers();
  }

  async toggleLocalAudio() {
    const trackID = this.store(localAudioTrackIDSelector);
    if (trackID) {
      const isEnabled = this.store(isLocalAudioEnabledSelector);
      await this.hmsSDKTracks[trackID].setEnabled(!isEnabled);
      this.syncPeers();
    }
  }

  async toggleLocalVideo() {
    const trackID = this.store(localVideoTrackIDSelector);
    if (trackID) {
      const isEnabled = this.store(isLocalVideoEnabledSelector);
      await this.hmsSDKTracks[trackID].setEnabled(!isEnabled);
      this.syncPeers();
    }
  }

  sendMessage(message: string) {
    const sdkMessage= this.sdk.sendMessage(HMSMessageType.CHAT, message);
    const hmsMessage = SDKToHMS.convertMessage(sdkMessage) as HMSMessage;
    hmsMessage.read = true;
    hmsMessage.senderName = "You";
    this.onHMSMessage(hmsMessage);
  }

  getStore(): UseStore<HMSStore> {
    return this.store;
  }

  private syncPeers() {
    const sdkPeers: sdkTypes.HMSPeer[] = this.sdk.getPeers();
    const hmsPeers: Record<HMSPeerID, HMSPeer> = {};
    const hmsPeerIDs: HMSPeerID[] = [];
    const hmsTracks: Record<HMSTrackID, HMSTrack> = {}
    const oldHMSPeers = this.store(peersMapSelector);
    const oldHMSTracks = this.store(tracksMapSelector);
    this.hmsSDKTracks = {};
    this.store.setState(store => {
      for (let sdkPeer of sdkPeers) {
        let hmsPeer = SDKToHMS.convertPeer(sdkPeer);
        if (hmsPeer.id in oldHMSPeers) {
          // update existing object so if there isn't a change, reference is not changed
          Object.assign(oldHMSPeers[hmsPeer.id], hmsPeer)
          hmsPeer = oldHMSPeers[hmsPeer.id]
        }
        hmsPeers[hmsPeer.id] = hmsPeer as HMSPeer;
        hmsPeerIDs.push(hmsPeer.id);
        this.addPeerTracks(oldHMSTracks, hmsTracks, sdkPeer);
      }
      if (!this.arraysEqual(store.room.peers, hmsPeerIDs)) {
        store.room.peers = hmsPeerIDs;
      }
      store.peers = hmsPeers;
      store.tracks = hmsTracks;
    })
  }

  private addPeerTracks(oldHmsTracks: Record<HMSTrackID, HMSTrack>,
                        hmsTracksDraft: Record<HMSTrackID, HMSTrack>,
                        sdkPeer: sdkTypes.HMSPeer) {
    const addTrack = (sdkTrack: sdkTypes.HMSTrack) => {
      this.hmsSDKTracks[sdkTrack.trackId] = sdkTrack;
      let hmsTrack = SDKToHMS.convertTrack(sdkTrack);
      if (hmsTrack.id in oldHmsTracks) {
        Object.assign(oldHmsTracks[hmsTrack.id], hmsTrack);
        hmsTrack = oldHmsTracks[hmsTrack.id];
      }
      hmsTracksDraft[hmsTrack.id] = hmsTrack;
    }
    if (sdkPeer.audioTrack) {
      addTrack(sdkPeer.audioTrack);
    }
    if (sdkPeer.videoTrack) {
      addTrack(sdkPeer.videoTrack);
    }
    sdkPeer.auxiliaryTracks.forEach(sdkTrack => addTrack(sdkTrack));
  }

  private arraysEqual(arr1: string[], arr2: string[]) {
    if (arr1.length != arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; ++i) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  private onJoin(_room: sdkTypes.HMSRoom) {
    this.syncPeers();
  }

  private onRoomUpdate() {
    this.syncPeers();
  }

  private onPeerUpdate(type: sdkTypes.HMSPeerUpdate, sdkPeer: sdkTypes.HMSPeer) {
    if (type === sdkTypes.HMSPeerUpdate.BECAME_DOMINANT_SPEAKER ||
    type === sdkTypes.HMSPeerUpdate.RESIGNED_DOMINANT_SPEAKER) {
      const isDominantSpeaker = type === sdkTypes.HMSPeerUpdate.BECAME_DOMINANT_SPEAKER;
      this.store.setState(store => {
        const hmsPeer = store.peers[sdkPeer.peerId];
        if (hmsPeer) {
          hmsPeer.isDominantSpeaker = isDominantSpeaker;
        }
      })
    } else {
      this.syncPeers()
    }
  }

  private onTrackUpdate() {
    this.syncPeers();
  }

  private onMessageReceived(sdkMessage: sdkTypes.HMSMessage) {
    const hmsMessage = SDKToHMS.convertMessage(sdkMessage) as HMSMessage;
    hmsMessage.read = false;
    hmsMessage.senderName = peerNameByIDSelector(this.store.getState(), hmsMessage.sender);
    this.onHMSMessage(hmsMessage);
  }

  private onHMSMessage(hmsMessage: HMSMessage) {
    this.store.setState(store => {
      hmsMessage.id = String(this.store(messagesCountSelector) + 1);
      store.messages.byID[hmsMessage.id] = hmsMessage;
      store.messages.allIDs.push(hmsMessage.id);
    })
  }

  private onAudioLevelUpdate(speakers: sdkTypes.HMSSpeaker[]) {
    this.store.setState((store) => {
      speakers.forEach(speaker => {
        store.peers[speaker.peerId].audioLevel = speaker.audioLevel;
      })
    })
  }

  private onError(error: sdkTypes.HMSException) {
    HMSLogger.e("sdkError", "received error from sdk", error);
  }
}