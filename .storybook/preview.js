import '../src/index.css';
import { HMSRoomProvider } from '../src';
import { StoryBookSDK } from './StoryBookSDK';
import { createNewStore } from '../src/store';

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

const storyBookStore = createNewStore();
export const storyBookSDK = new StoryBookSDK(storyBookStore);

export const decorators = [
  (Story) => (
    <HMSRoomProvider store={storyBookStore} sdk={storyBookSDK}>
      <Story />
    </HMSRoomProvider>
  ),
];
