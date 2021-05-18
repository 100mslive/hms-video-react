import { HMSMessage, HMSPeer, HMSStore } from '../schema';
import { HMSSdk } from '@100mslive/100ms-web-sdk/dist';
import { IHMSStore } from '../IHMSStore';
import { UseStore } from 'zustand';
import IHMSBridge from '../IHMSBridge';
import * as sdkTypes from './sdkTypes';

export default class HMSSDKBridge implements IHMSBridge {
  private hmsTracks: Record<string, sdkTypes.HMSTrack> = {};
  private readonly sdk: HMSSdk;
  private readonly store: IHMSStore<UseStore<HMSStore>>;

  constructor(sdk: HMSSdk, store: IHMSStore<UseStore<HMSStore>>) {
    this.sdk = sdk;
    this.store = store;
  }

  join(config: sdkTypes.HMSConfig) {
    this.sdk.join(config, {
      onJoin: this.onJoin,
      onRoomUpdate: this.onRoomUpdate,
      onPeerUpdate: this.onPeerUpdate,
      onTrackUpdate: this.onTrackUpdate,
      onMessageReceived: this.onMessageReceived,
      onError: this.onError,
    });
    this.sdk.addAudioListener({
      onAudioLevelUpdate: this.onAudioLevelUpdate
    });
  }

  leave(): void {
    throw new Error('Method not implemented.');
  }

  startScreenShare(): void {
    throw new Error('Method not implemented.');
  }

  stopScreenShare(): void {
    throw new Error('Method not implemented.');
  }

  toggleLocalAudio(): void {
    throw new Error('Method not implemented.');
  }

  toggleLocalVideo(): void {
    throw new Error('Method not implemented.');
  }

  sendMessage(message: HMSMessage): HMSMessage {
    throw new Error('Method not implemented.');
  }

  getStore(): IHMSStore<any> {
    throw new Error('store is not yet setup');
  }

  private onJoin(room: sdkTypes.HMSRoom) {

  }

  private onRoomUpdate(type: sdkTypes.HMSRoomUpdate, room: sdkTypes.HMSRoom) {

  }

  private onPeerUpdate(type: sdkTypes.HMSPeerUpdate, peer: sdkTypes.HMSPeer) {

  }

  private onTrackUpdate(type: sdkTypes.HMSTrackUpdate, track: sdkTypes.HMSTrack, peer: sdkTypes.HMSPeer) {

  }

  private onMessageReceived(message: sdkTypes.HMSMessage) {

  }

  private onAudioLevelUpdate(speakers: sdkTypes.HMSSpeaker[]) {

  }

  private onError(error: sdkTypes.HMSException) {

  }
}