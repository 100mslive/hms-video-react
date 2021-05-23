import { IHMSBridge } from '../../store';
import { IHMSStore } from '../../store';
import { makeFakeMessage } from '../fixtures/chatFixtures';
import { HMSPeer, HMSRoom } from '../../store/schema';

/*
This is a dummy bridge with no connected backend. It can be used for
storybook or writing functional tests.
 */
export class StoryBookSDK implements IHMSBridge {
  private readonly store: IHMSStore;
  private videoURLs: string[] = [];
  private dummyTrackURLs: Record<string, string> = {};
  private counter: number = 0;

  constructor(store: IHMSStore) {
    this.store = store;
  }

  join(...args: any[]): void {
    const joinParams = args[0];
    if (!(joinParams.username && joinParams.role && joinParams.roomId)) {
      this.log("invalid params");
      return;
    }
    this.log("User joining room");
    this.store.setState(store => {
      store.room.isConnected = true;
      store.room.id = joinParams.roomId;
      const newPeer: HMSPeer = {
        name: joinParams?.username,
        role: joinParams?.role,
        isLocal: true,
        id: String(this.randomNumber()),
        auxiliaryTracks: []
      }
      store.room.peers.push(newPeer.id);
      store.peers[newPeer.id] = newPeer;
    })
  }

  attachVideo(trackID: string, videoElement: HTMLVideoElement): void {
    if (this.dummyTrackURLs[trackID]) {
      videoElement.src = this.dummyTrackURLs[trackID];
    }
    this.log("video attached");
  }

  leave(): void {
    this.log("user left room")
    this.store.setState(store => {
      store.room.isConnected = false;
    })
  }

  removeVideo(trackID: string, videoElement: HTMLVideoElement): void {
    videoElement.srcObject = null;
    this.log("video removed");
  }

  sendMessage(message: string, randomUser?: boolean): void {
    this.store.setState(store => {
      const user = randomUser ? this.randomUser() : "You";
      const newMsg = makeFakeMessage(message, user);
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
    const randomURL = this.randomFromArray(this.videoURLs);
    const videoTrackID = String(this.videoURLs.indexOf(randomURL) || this.counter++);
    const audioTrackID = String(this.counter++);
    this.dummyTrackURLs[videoTrackID] = randomURL;
    peer.audioTrack = audioTrackID;
    peer.videoTrack = videoTrackID;
    this.store.setState(store => {
      store.peers[peer.id] = peer;
      store.room.peers.push(peer.id);
      store.speakers[peer.id] = {
        audioLevel: this.randomFromArray([0, 10, 20, 50, 70, 80, 100])
      }
      if (peer.audioTrack) {
        store.tracks[videoTrackID] = {
          enabled: true, id: audioTrackID, type: "audio"
        };
      }
      if (peer.videoTrack) {
        store.tracks[videoTrackID] = {
          enabled: true, id: videoTrackID, type: "video"
        };
      }
    })
  }

  addTestVideoURLs(urls: string[]) {
    this.videoURLs = urls;
  }

  getRandomPeer(): HMSPeer {
    return this.randomFromArray(this.getPeers());
  }

  getPeers(): HMSPeer[] {
    return Object.values(this.store.getState().peers);
  }

  private log(...args: any[]) {
    console.log("storybook sdk", ...args);
  }

  private randomUser() {
    return this.randomFromArray(["You", "Tushar", "Eswar", "Aniket", "Kshitiz", "Sagar"]);
  }

  private randomNumber() {
    return Number(Math.floor(Math.random() * 100000));
  }

  private randomFromArray<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

}
