import { IHMSBridge } from '../src/store';
import { IHMSStore } from '../src/store';

/*
This is a dummy bridge with no connected backend. It can be used for
storybook or writing functional tests.
 */
export class StoryBookSDK implements IHMSBridge {
  private readonly store: IHMSStore;

  constructor(store: IHMSStore) {
    this.store = store;
  }

  join(...args: any[]): void {
    this.log("User joined room");
  }

  attachVideo(trackID: string, videoElement: HTMLVideoElement): void {
    this.log("video attached");
  }

  leave(): void {
    this.log("user left room")
  }

  removeVideo(trackID: string, videoElement: HTMLVideoElement): void {
    this.log("video removed");
  }

  sendMessage(message: string): void {
    this.log("message sent - ", message);
  }

  setLocalAudioEnabled(enabled: boolean): void {
    this.log("set local audio enabled state - ", enabled);
  }

  setLocalVideoEnabled(enabled: boolean): void {
    this.log("set local video enabled state - ", enabled);
  }

  setScreenShareEnabled(enabled: boolean): void {
    this.log("set screenshare enabled state - ", enabled);
  }

  private log(...args: any[]) {
    console.log("storybook sdk", ...args);
  }

}