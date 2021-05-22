import create, { StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createDefaultStoreState, HMSStore } from './schema';
import produce, { Immutable, Draft } from 'immer';

type ImmutableHMSStore = Immutable<HMSStore>;

const log = <T extends ImmutableHMSStore>(
  config: StateCreator<T>,
): StateCreator<T> => {
  return (set, get, api) => {
    return config(
      args => {
        console.log('  applying', args);
        set(args);
        console.log('  new state', get());
      },
      get,
      api,
    );
  };
};

// immer middleware for all set operations
type immerConfigType<T extends ImmutableHMSStore> = StateCreator<
  T,
  (fn: (draft: Draft<T>) => void) => void
>;
const immer = <T extends ImmutableHMSStore>(
  config: immerConfigType<T>,
): StateCreator<T> => {
  return (set, get, api) => {
    return config(fn => set(produce(fn) as (state: T) => T), get, api);
  };
};

// One store is required per room
export const createNewStore = () => {
  return create<HMSStore>(
    log(
      devtools(
        immer(_set => (createDefaultStoreState())),
      ),
    ),
  );
};
