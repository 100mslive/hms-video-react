import { HMSStore } from '../schema';
import { createSelector } from 'reselect';

export const selectMessagesMap = (store: HMSStore) => store.messages;

export const selectMessagesCount = createSelector(
  selectMessagesMap,
  messages => messages.allIDs.length,
);
