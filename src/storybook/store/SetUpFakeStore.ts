import { fakeMessages } from '../fixtures/chatFixtures';
import { fakeParticipants } from '../fixtures/peersFixtures';
import { StoryBookSDK } from './StoryBookSDK';
import { HMSReactiveStore } from '@100mslive/hms-video-store';

export const storyBookStore = HMSReactiveStore.createNewHMSStore();
export const storyBookSDK = new StoryBookSDK(storyBookStore);

const videoURLS = [
  'https://res.cloudinary.com/dlzh3j8em/video/upload/v1618618376/Screen_Recording_2021-04-17_at_5.36.24_AM_if70nz_wl31nt.mp4',
  'https://res.cloudinary.com/dlzh3j8em/video/upload/v1618618246/pexels-mart-production-7261921_XCEC2bNM_osJG_lhdtua.mp4',
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
    storyBookSDK.sendMessage(msg.message, true);
  });
}
