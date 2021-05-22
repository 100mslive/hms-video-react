import {
  HMSMediaSettings,
  HMSMessage,
  HMSMessageType,
  HMSPeer,
  HMSPeerID,
  HMSTrack,
  HMSTrackID,
} from '../schema';
import { IHMSBridge } from '../IHMSBridge';
import * as sdkTypes from './sdkTypes';
import { SDKToHMS } from './adapter';
import {
  selectIsLocalAudioEnabled,
  selectIsLocalScreenShared,
  selectIsLocalVideoEnabled,
  selectLocalAudioTrackID,
  selectLocalVideoTrackID,
  selectHMSMessagesCount,
  selectPeerNameByID,
  selectPeersMap,
  selectTracksMap,
} from '../selectors';
import HMSLogger from '../../utils/ui-logger';
import { HMSSdk } from '@100mslive/100ms-web-sdk';
import { IHMSStore } from '../IHMSStore';
import SDKHMSException from '@100mslive/100ms-web-sdk/dist/error/HMSException';
import SDKHMSVideoTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSVideoTrack';
import SDKHMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';
import HMSLocalAudioTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSLocalAudioTrack';
import HMSLocalVideoTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSLocalVideoTrack';

export class HMSSDKBridge implements IHMSBridge {
  private hmsSDKTracks: Record<string, SDKHMSTrack> = {};
  private readonly sdk: HMSSdk;
  private readonly store: IHMSStore;
  private isRoomJoined: boolean = false;
  private isRoomLeft: boolean = false;

  constructor(sdk: HMSSdk, store: IHMSStore) {
    this.sdk = sdk;
    this.store = store;
  }

  join(config: sdkTypes.HMSConfig) {
    if (this.isRoomJoined) {
      this.logPossibleInconsistency('room join is called again');
      return; // ignore
    }
    this.sdk.join(config, {
      onJoin: this.onJoin.bind(this),
      onRoomUpdate: this.onRoomUpdate.bind(this),
      onPeerUpdate: this.onPeerUpdate.bind(this),
      onTrackUpdate: this.onTrackUpdate.bind(this),
      onMessageReceived: this.onMessageReceived.bind(this),
      onError: this.onError.bind(this),
    });
    this.sdk.addAudioListener({
      onAudioLevelUpdate: this.onAudioLevelUpdate.bind(this),
    });
    this.isRoomJoined = true;
  }

  leave(): void {
    if (this.isRoomLeft) {
      this.logPossibleInconsistency('room leave is called again');
      return; // ignore
    }
    this.sdk.leave().then(() => {
      HMSLogger.i('sdk', 'left room');
      this.store.destroy();
    });
    this.isRoomLeft = true;
  }

  async setScreenShareEnabled(enabled:boolean){
    if(enabled){
      this.startScreenShare();
    }
    else{
      this.stopScreenShare();
    }
  }

  private async startScreenShare() {
    const isScreenShared = this.store(selectIsLocalScreenShared);
    if (!isScreenShared) {
      await this.sdk.startScreenShare(this.syncPeers.bind(this));
      this.syncPeers();
    } else {
      this.logPossibleInconsistency("start screenshare is called while it's on")
    }
  }

  private async stopScreenShare() {
    const isScreenShared = this.store(selectIsLocalScreenShared);
    if (isScreenShared) {
      await this.sdk.stopScreenShare();
      this.syncPeers();
    } else {
      this.logPossibleInconsistency("stop screenshare is called while it's not on")
    }
  }

  async setLocalAudioEnabled(enabled: boolean) {
    const trackID = this.store(selectLocalAudioTrackID);
    // useHMSStore(localAudioTrackIDSelector)
    if (trackID) {
      const isCurrentEnabled = this.store(selectIsLocalAudioEnabled);
      if (isCurrentEnabled === enabled) {
        // why would same value will be set again?
        this.logPossibleInconsistency('local audio track muted states.');
      }
      await this.setEnabledTrack(trackID, enabled);
      this.syncPeers();
    }
  }

  async setLocalVideoEnabled(enabled: boolean) {
    const trackID = this.store(selectLocalVideoTrackID);
    if (trackID) {
      const isCurrentEnabled = this.store(selectIsLocalVideoEnabled);
      if (isCurrentEnabled === enabled) {
        // why would same value will be set again?
        this.logPossibleInconsistency('local video track muted states.');
      }
      this.store.setState(store => {  // show on UI immediately
        store.tracks[trackID].enabled = enabled;
      })
      try {
        await this.setEnabledTrack(trackID, enabled);
      } catch (err) {
        // rollback now
        this.store.setState(store => {
          store.tracks[trackID].enabled = !enabled;
        })
      }
      this.syncPeers();
    }
  }

  sendMessage(message: string) {
    if (message.trim() === '') {
      HMSLogger.d('Ignoring empty message send');
      return;
    }
    const sdkMessage = this.sdk.sendMessage(HMSMessageType.CHAT, message);
    const hmsMessage = SDKToHMS.convertMessage(sdkMessage) as HMSMessage;
    hmsMessage.read = true;
    hmsMessage.senderName = 'You';
    this.onHMSMessage(hmsMessage);
  }

  async attachVideo(trackID: string, videoElement: HTMLVideoElement) {
    const sdkTrack = this.hmsSDKTracks[trackID];
    if (sdkTrack && sdkTrack.type === 'video') {
      await (sdkTrack as SDKHMSVideoTrack).addSink(videoElement);
    } else {
      this.logPossibleInconsistency('no video track found to add sink');
    }
  }

  async removeVideo(trackID: string, videoElement: HTMLVideoElement) {
    const sdkTrack = this.hmsSDKTracks[trackID];
    if (sdkTrack && sdkTrack.type === 'video') {
      await (sdkTrack as SDKHMSVideoTrack).removeSink(videoElement);
    } else {
      this.logPossibleInconsistency('no video track found to remove sink');
    }
  }

  protected syncPeers() {
    const sdkPeers: sdkTypes.HMSPeer[] = this.sdk.getPeers();
    const hmsPeers: Record<HMSPeerID, HMSPeer> = {};
    const hmsPeerIDs: HMSPeerID[] = [];
    const hmsTracks: Record<HMSTrackID, HMSTrack> = {};
    const oldHMSPeers = this.store(selectPeersMap);
    const oldHMSTracks = this.store(selectTracksMap);
    this.hmsSDKTracks = {};
    this.store.setState(store => {
      for (let sdkPeer of sdkPeers) {
        let hmsPeer = SDKToHMS.convertPeer(sdkPeer);
        if (hmsPeer.id in oldHMSPeers) {
          // update existing object so if there isn't a change, reference is not changed
          Object.assign(oldHMSPeers[hmsPeer.id], hmsPeer);
          hmsPeer = oldHMSPeers[hmsPeer.id];
        }
        hmsPeers[hmsPeer.id] = hmsPeer as HMSPeer;
        hmsPeerIDs.push(hmsPeer.id);
        this.addPeerTracks(oldHMSTracks, hmsTracks, sdkPeer);
        if (hmsPeer.isLocal) {
          const newSettings: HMSMediaSettings = {
            audioInputDeviceId: (sdkPeer.audioTrack as HMSLocalAudioTrack)?.settings?.deviceId,
            videoInputDeviceId: (sdkPeer.audioTrack as HMSLocalVideoTrack)?.settings?.deviceId,
          }
          Object.assign(store.settings, newSettings);
        }
      }
      if (!this.arraysEqual(store.room.peers, hmsPeerIDs)) {
        store.room.peers = hmsPeerIDs;
      }
      store.peers = hmsPeers;
      store.tracks = hmsTracks;
    });
  }

  private addPeerTracks(
    oldHmsTracks: Record<HMSTrackID, HMSTrack>,
    hmsTracksDraft: Record<HMSTrackID, HMSTrack>,
    sdkPeer: sdkTypes.HMSPeer,
  ) {
    const addTrack = (sdkTrack: SDKHMSTrack) => {
      this.hmsSDKTracks[sdkTrack.trackId] = sdkTrack;
      let hmsTrack = SDKToHMS.convertTrack(sdkTrack);
      if (hmsTrack.id in oldHmsTracks) {
        Object.assign(oldHmsTracks[hmsTrack.id], hmsTrack);
        hmsTrack = oldHmsTracks[hmsTrack.id];
      }
      hmsTracksDraft[hmsTrack.id] = hmsTrack;
    };
    if (sdkPeer.audioTrack) {
      addTrack(sdkPeer.audioTrack);
    }
    if (sdkPeer.videoTrack) {
      addTrack(sdkPeer.videoTrack);
    }
    sdkPeer.auxiliaryTracks.forEach(sdkTrack => addTrack(sdkTrack));
  }

  private arraysEqual(arr1: string[], arr2: string[]) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; ++i) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  protected onJoin(sdkRoom: sdkTypes.HMSRoom) {
    this.store.setState(store => {
      Object.assign(store.room, SDKToHMS.convertRoom(sdkRoom));
      store.room.isConnected = true;
    })
    this.syncPeers();
  }

  protected onRoomUpdate() {
    this.syncPeers();
  }

  protected onPeerUpdate(
    type: sdkTypes.HMSPeerUpdate,
    sdkPeer: sdkTypes.HMSPeer,
  ) {
    if (
      type === sdkTypes.HMSPeerUpdate.BECAME_DOMINANT_SPEAKER ||
      type === sdkTypes.HMSPeerUpdate.RESIGNED_DOMINANT_SPEAKER
    ) {
      const isDominantSpeaker =
        type === sdkTypes.HMSPeerUpdate.BECAME_DOMINANT_SPEAKER;
      this.store.setState(store => {
        const hmsPeer = store.peers[sdkPeer.peerId];
        if (hmsPeer) {
          hmsPeer.isDominantSpeaker = isDominantSpeaker;
        }
      });
    } else {
      this.syncPeers();
    }
  }

  protected onTrackUpdate() {
    this.syncPeers();
  }

  protected onMessageReceived(sdkMessage: sdkTypes.HMSMessage) {
    const hmsMessage = SDKToHMS.convertMessage(sdkMessage) as HMSMessage;
    hmsMessage.read = false;
    hmsMessage.senderName = selectPeerNameByID(
      this.store.getState(),
      hmsMessage.sender,
    );
    this.onHMSMessage(hmsMessage);
  }

  protected onHMSMessage(hmsMessage: HMSMessage) {
    this.store.setState(store => {
      hmsMessage.id = String(this.store(selectHMSMessagesCount) + 1);
      store.messages.byID[hmsMessage.id] = hmsMessage;
      store.messages.allIDs.push(hmsMessage.id);
    });
  }

  /*
  note: speakers array contain the value only for peers who have audioLevel != 0
   */
  protected onAudioLevelUpdate(speakers: sdkTypes.HMSSpeaker[]) {
    this.store.setState(store => {
      const peerIDAudioLevelMap: Record<HMSPeerID, number> = {};
      speakers.forEach(speaker => {
        peerIDAudioLevelMap[speaker.peerId] = speaker.audioLevel;
      });
      for (let [peerID, speaker] of Object.entries(store.speakers)) {
        speaker.audioLevel = peerIDAudioLevelMap[peerID] || 0;
      }
    });
  }

  protected onError(error: SDKHMSException) {
    HMSLogger.e('sdkError', 'received error from sdk', error);
  }

  private async setEnabledTrack(trackID: string, enabled: boolean) {
    const track = this.hmsSDKTracks[trackID];
    if (track) {
      await track.setEnabled(enabled);
    } else {
      HMSLogger.e(
        'sdk',
        'track not present, unable to enabled/disable',
        trackID,
      );
    }
  }

  private logPossibleInconsistency(a: string) {
    HMSLogger.w('store', 'possible inconsistency detected - ', a);
  }
}
