import { HMSStore } from '../schema';
import { createSelector } from 'reselect';

export const messagesMapSelector = (store: HMSStore) => store.messages;

export const messagesCountSelector = createSelector(
  messagesMapSelector,
  (messages) => messages.allIDs.length
)
