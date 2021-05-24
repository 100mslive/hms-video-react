import { EqualityChecker, StateSelector } from 'zustand';
import { HMSStore, IHMSBridge, IHMSStore } from '../store';
import React, { useContext } from 'react';
import type { IHMSStoreReadOnly } from '../store/IHMSStore';
import HMSLogger from '../utils/ui-logger';

export interface HMSContextProviderProps {
  sdk: IHMSBridge; // for actions which may also mutate store
  store: IHMSStoreReadOnly; // readonly store, don't mutate this
}

export function makeHMSStoreHook(hmsContext: React.Context<HMSContextProviderProps | null>) {
  const useHMSStore = <StateSlice>(
    selector: StateSelector<HMSStore, StateSlice>,
    equalityFn: EqualityChecker<StateSlice> = Object.is,
  ) => {
    if (!selector) {
      HMSLogger.w("store", "fetching full store may have a heavy performance impact on your website.")
    }
    const HMSContextConsumer = useContext(hmsContext);
    if (!HMSContextConsumer) {
      throw new Error('HMSContext state variables are not set');
    }
    const useStore = HMSContextConsumer.store as IHMSStore;
    return useStore(selector, equalityFn);
  };
  return useHMSStore;
}