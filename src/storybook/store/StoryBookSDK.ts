import { makeFakeMessage } from '../fixtures/chatFixtures';
import {
  IHMSActions,
  IHMSStore,
  HMSPeer,
  HMSRoom,
  HMSTrackSource,
  HMSRoomState,
} from '@100mslive/hms-video-store';
import {
  HMSAudioTrackSettings,
  HMSVideoTrackSettings,
} from '@100mslive/hms-video-store';
import HMSConfig from '@100mslive/hms-video/dist/interfaces/config';

/*
This is a dummy bridge with no connected backend. It can be used for
storybook or writing functional tests.
 */
export class StoryBookSDK implements IHMSActions {
  private readonly store: IHMSStore;
  private videoURLs: string[] = [];
  private dummyTrackURLs: Record<string, string> = {};
  private counter: number = 100;

  constructor(store: IHMSStore) {
    this.store = store;
  }
  addTrack(track: MediaStreamTrack, type: HMSTrackSource): Promise<void> {
    throw new Error('Method not implemented.');
  }
  removeTrack(trackId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setEnabledTrack(trackId: string, enabled: boolean): Promise<void> {
    throw new Error('Method not implemented.');
  }

  setMessageRead(readStatus: boolean, messageId: string): void {
    this.store.setState(store => {
      if (messageId) {
        if (!store.messages.byID[messageId]) {
          return;
        } else {
          store.messages.byID[messageId].read = readStatus;
        }
      } else {
        store.messages.allIDs.forEach((id: string) => {
          store.messages.byID[id].read = readStatus;
        });
      }
    });
  }

  preview(config: HMSConfig) {
    if (!config.authToken) {
      this.log('invalid params');
      return;
    }
    this.log('User called preview');
    this.store.setState(store => {
      store.room.roomState = HMSRoomState.Preview;
      const newPeer: HMSPeer = {
        name: config?.userName,
        isLocal: true,
        id: String(this.randomNumber()),
        auxiliaryTracks: [],
      };
      store.room.peers.push(newPeer.id);
      store.peers[newPeer.id] = newPeer;
    });
  }

  join(...args: any[]): void {
    const joinParams = args[0];
    if (!(joinParams.username && joinParams.role && joinParams.roomId)) {
      this.log('invalid params');
      return;
    }
    this.log('User joining room');
    this.store.setState(store => {
      store.room.isConnected = true;
      store.room.id = joinParams.roomId;
      const newPeer: HMSPeer = {
        name: joinParams?.username,
        role: joinParams?.role,
        isLocal: true,
        id: String(this.randomNumber()),
        auxiliaryTracks: [],
      };
      store.room.peers.push(newPeer.id);
      store.peers[newPeer.id] = newPeer;
    });
  }

  async attachVideo(
    trackID: string,
    videoElement: HTMLVideoElement,
  ): Promise<void> {
    if (this.dummyTrackURLs[trackID]) {
      videoElement.src = this.dummyTrackURLs[trackID];
    }
    this.log('video attached');
  }

  async leave(): Promise<void> {
    this.log('user left room');
    this.store.setState(store => {
      store.room.isConnected = false;
    });
  }

  async detachVideo(
    trackID: string,
    videoElement: HTMLVideoElement,
  ): Promise<void> {
    videoElement.srcObject = null;
    this.log('video removed');
  }

  sendMessage(message: string, randomUser?: boolean): void {
    this.store.setState(store => {
      const user = randomUser ? this.randomUser() : 'You';
      const newMsg = makeFakeMessage(message, user);
      store.messages.byID[newMsg.id] = newMsg;
      store.messages.allIDs.push(newMsg.id);
    });
    this.log('message sent - ', message);
  }

  async setLocalAudioEnabled(enabled: boolean): Promise<void> {
    this.log('set local audio enabled state - ', enabled);
  }

  async setLocalVideoEnabled(enabled: boolean): Promise<void> {
    this.log('set local video enabled state - ', enabled);
  }

  async setScreenShareEnabled(enabled: boolean): Promise<void> {
    this.log('set screenshare enabled state - ', enabled);
  }

  addTestRoom(room: Partial<HMSRoom>) {
    this.store.setState(store => {
      Object.assign(store.room, room);
    });
  }

  addTestPeerAndSpeaker(peer: HMSPeer) {
    const randomURL = this.randomFromArray(this.videoURLs);
    const videoTrackID = String(
      this.videoURLs.indexOf(randomURL) || this.counter++,
    );
    const audioTrackID = String(this.counter++);
    this.dummyTrackURLs[videoTrackID] = randomURL;
    peer.audioTrack = audioTrackID;
    peer.videoTrack = videoTrackID;
    this.store.setState(store => {
      store.peers[peer.id] = peer;
      store.room.peers.push(peer.id);
      store.speakers[peer.id] = {
        audioLevel: this.randomFromArray([0, 10, 20, 50, 70, 80, 100]),
      };
      if (peer.audioTrack) {
        store.tracks[audioTrackID] = {
          enabled: this.randomFromArray([true, false]),
          id: audioTrackID,
          type: 'audio',
        };
      }
      if (peer.videoTrack) {
        store.tracks[videoTrackID] = {
          enabled: true,
          id: videoTrackID,
          type: 'video',
        };
      }
    });
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
    console.log('storybook sdk', ...args);
  }

  private randomUser() {
    return this.randomFromArray([
      'You',
      'Tushar',
      'Eswar',
      'Aniket',
      'Kshitiz',
      'Sagar',
    ]);
  }

  private randomNumber() {
    return Number(Math.floor(Math.random() * 100000));
  }

  private randomFromArray<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async setAudioSettings(settings: HMSAudioTrackSettings): Promise<void> {}

  async setVideoSettings(settings: HMSVideoTrackSettings): Promise<void> {}
}
