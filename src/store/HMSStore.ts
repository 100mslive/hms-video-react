import create, { SetState, StateCreator } from 'zustand';
import {HMSStore} from './schema';
import produce, { Draft } from 'immer';

// imnmer middleware for all set operations
const immer = <T extends HMSStore>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config((fn) => set(produce(fn) as (state: T) => T), get, api)

const useStore = create<HMSStore>(immer((set) => ({
  rooms: {byID: {}, allIDs: []},
  peers: {byID: {}, allIDs: []},
  tracks: {byID: {}, allIDs: []},
  messages: {byID: {}, allIDs: []},
})))
