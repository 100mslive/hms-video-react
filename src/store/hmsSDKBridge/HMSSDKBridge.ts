import { HMSMessage, HMSPeer, HMSStore } from '../schema';
import { HMSSdk } from '@100mslive/100ms-web-sdk/dist';
import SDKHMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';
import { IHMSStore } from '../IHMSStore';
import { UseStore } from 'zustand';
import IHMSBridge from '../IHMSBridge';

export default class HMSSDKBridge implements IHMSBridge {
  hmsTracks: Record<string, SDKHMSTrack> = {};
  sdk?: HMSSdk;
  store?: IHMSStore<UseStore<HMSStore>>;

  constructor(sdk: HMSSdk, store: IHMSStore<UseStore<HMSStore>>) {
    this.sdk = sdk;
    this.store = store;
  }

  join() {
    throw new Error('Method not implemented.');
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
    if (this.store) {
      return this.store;
    }
    throw new Error('store is not yet setup');
  }

}