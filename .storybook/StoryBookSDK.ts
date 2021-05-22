import { IHMSBridge } from '../src/store';
import { IHMSStore } from '../src/store';
import { makeFakeMessage } from '../src/storybook/fixtures/chatFixtures';
import { HMSPeer, HMSRoom } from '../src/store/schema';

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
    this.store.setState(store => {
      store.room.isConnected = true;
    })
  }

  attachVideo(trackID: string, videoElement: HTMLVideoElement): void {
    this.log("video attached");
  }

  leave(): void {
    this.log("user left room")
    this.store.setState(store => {
      store.room.isConnected = false;
    })
  }

  removeVideo(trackID: string, videoElement: HTMLVideoElement): void {
    this.log("video removed");
  }

  sendMessage(message: string): void {
    this.store.setState(store => {
      const newMsg = makeFakeMessage(message, this.randomUser());
      store.messages.byID[newMsg.id] = newMsg;
      store.messages.allIDs.push(newMsg.id);
    })
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

  addTestRoom(room: Partial<HMSRoom>) {
    this.store.setState(store => {
      Object.assign(store.room, room);
    })
  }

  addTestPeerAndSpeaker(peer: HMSPeer) {
    this.store.setState(store => {
      store.peers[peer.id] = peer;
      store.room.peers.push(peer.id);
      store.speakers[peer.id] = {
        id: peer.id,
        audioLevel: this.randomFromArray([0, 10, 20, 50, 70, 80, 100])
      }
    })
  }

  private log(...args: any[]) {
    console.log("storybook sdk", ...args);
  }

  private randomUser() {
    return this.randomFromArray(["You", "Tushar", "Eswar", "Anniket", "Kshitiz", "Sagar"]);
  }

  private randomFromArray(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

}