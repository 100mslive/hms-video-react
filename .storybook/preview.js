import '../src/index.css';
import { HMSRoomProvider } from '../src';
import { setUpFakeStore, storyBookSDK, storyBookStore } from '../src/storybook/store/SetUpFakeStore';

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

setUpFakeStore();

export const decorators = [
  (Story) => (
    <HMSRoomProvider store={storyBookStore} sdk={storyBookSDK}>
      <Story />
    </HMSRoomProvider>
  ),
];
