import { fakeMessages } from '../fixtures/chatFixtures';
import { fakeParticipants } from '../fixtures/peersFixtures';
import { createNewStore } from '../../store';
import { StoryBookSDK } from './StoryBookSDK';

export const storyBookStore = createNewStore();
export const storyBookSDK = new StoryBookSDK(storyBookStore);

export function setUpFakeStore() {
  storyBookSDK.addTestRoom({
    id: "123",
    name: "storybook room",
    peers: [],
  })
  fakeParticipants.map(peerWithMute => {
    storyBookSDK.addTestPeerAndSpeaker(peerWithMute.peer);
  })
  fakeMessages.map(msg => {
    storyBookSDK.sendMessage(msg.message, true);
  })
}
