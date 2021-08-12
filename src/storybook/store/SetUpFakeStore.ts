import { fakeMessages } from '../fixtures/chatFixtures';
import { fakeParticipants } from '../fixtures/peersFixtures';
import { StoryBookSDK } from './StoryBookSDK';
import { HMSReactiveStore, HMSStore } from '@100mslive/hms-video-store';
import create from 'zustand';

const store = HMSReactiveStore.createNewHMSStore();
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
