import { EqualityChecker, StateSelector } from 'zustand';
import React, { useContext } from 'react';
import HMSLogger from '../utils/ui-logger';
import shallow from 'zustand/shallow';
import { IHMSReactStore } from './HMSRoomProvider';
import { IHMSActions, HMSStore } from '@100mslive/hms-video-store';

export interface HMSContextProviderProps {
  actions: IHMSActions; // for actions which may also mutate store
  store: IHMSReactStore; // readonly store, don't mutate this
}

export function makeHMSStoreHook(
  hmsContext: React.Context<HMSContextProviderProps | null>,
) {
  const useHMSStore = <StateSlice>(
    selector: StateSelector<HMSStore, StateSlice>,
    equalityFn: EqualityChecker<StateSlice> = shallow,
  ) => {
    if (!selector) {
      HMSLogger.w(
        'fetching full store without passing any selector may have a heavy performance impact on your website.',
      );
    }
    const HMSContextConsumer = useContext(hmsContext);
    if (!HMSContextConsumer) {
      throw new Error('HMSContext state variables are not set');
    }
    const useStore = HMSContextConsumer.store;
    return useStore(selector, equalityFn);
  };
  return useHMSStore;
}
