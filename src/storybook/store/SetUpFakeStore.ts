import { fakeMessages } from '../fixtures/chatFixtures';
import { fakeParticipants } from '../fixtures/peersFixtures';
import { StoryBookSDK } from './StoryBookSDK';
import {
  HMSReactiveStore,
  HMSRoomState,
  HMSStore,
} from '@100mslive/hms-video-store';
import create from 'zustand';

const createDefaultStoreState = (): HMSStore => {
  return {
    room: {
      id: '',
      isConnected: false,
      name: '',
      peers: [],
      shareableLink: '',
      localPeer: '',
      hasWaitingRoom: false,
      roomState: HMSRoomState.Disconnected,
      recording: {
        browser: {
          running: false,
        },
        server: {
          running: false,
        },
      },
      rtmp: {
        running: false,
      },
      hls: {
        running: false,
        variants: [],
      },
      sessionId: '',
    },
    peers: {},
    tracks: {},
    playlist: {
      audio: {
        list: {},
        selection: { id: '', hasPrevious: false, hasNext: false },
        progress: 0,
        volume: 0,
        currentTime: 0,
        playbackRate: 1.0,
      },
      video: {
        list: {},
        selection: { id: '', hasPrevious: false, hasNext: false },
        progress: 0,
        volume: 0,
        currentTime: 0,
        playbackRate: 1.0,
      },
    },
    messages: { byID: {}, allIDs: [] },
    speakers: {},
    settings: {
      audioInputDeviceId: '',
      audioOutputDeviceId: '',
      videoInputDeviceId: '',
    },
    devices: {
      audioInput: [],
      audioOutput: [],
      videoInput: [],
    },
    roles: {},
    roleChangeRequests: [],
    errors: [],
  };
};

const store = HMSReactiveStore.createNewHMSStore(
  'HMSStore',
  createDefaultStoreState,
);
export const storyBookStore = create<HMSStore>(store);
export const storyBookSDK = new StoryBookSDK(store);

const videoURLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
];

export function setUpFakeStore() {
  storyBookSDK.addTestRoom({
    id: '123',
    name: 'storybook room',
    peers: [],
  });
  storyBookSDK.addTestVideoURLs(videoURLS);
  fakeParticipants.map(peerWithMute => {
    storyBookSDK.addTestPeerAndSpeaker(peerWithMute.peer);
  });
  fakeMessages.map(msg => {
    storyBookSDK.sendMessage(msg.message);
  });
}
