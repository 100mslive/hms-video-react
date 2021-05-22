import { fakeMessages } from '../src/storybook/fixtures/chatFixtures';
import { storyBookSDK } from './preview';
import { fakeParticipants } from '../src/storybook/fixtures/peersFixtures';

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
    storyBookSDK.sendMessage(msg.message);
  })
}
