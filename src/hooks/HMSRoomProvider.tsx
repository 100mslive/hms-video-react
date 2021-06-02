import React, { createContext, useContext } from 'react';
import {
  HMSReactiveStore,
  HMSStore,
  IHMSActions,
} from '@100mslive/hms-video-store';
import { IHMSStoreReadOnly } from '@100mslive/hms-video-store';
import create, { EqualityChecker, StateSelector } from 'zustand';
import { HMSContextProviderProps, makeHMSStoreHook } from './storeHook';

export interface IHMSReactStore extends IHMSStoreReadOnly {
  <U>(selector: StateSelector<HMSStore, U>, equalityFn?: EqualityChecker<U>): U;
}

export interface HMSRoomProviderProps {
  actions?: IHMSActions;
  store?: IHMSReactStore;
}

/**
 * only one context is being created currently. This would need to be changed if multiple
 * rooms have to be supported, where every room will have its own context, provider, store and actions.
 */
const HMSContext = createContext<HMSContextProviderProps | null>(null);

let providerProps: HMSContextProviderProps;
export const HMSRoomProvider: React.FC<HMSRoomProviderProps> = ({
  children,
  ...props
}) => {
  if (!providerProps) {
    if (props.actions && props.store) {
      providerProps = { actions: props.actions, store: props.store };
    } else {
      const hmsReactiveStore = new HMSReactiveStore();
      providerProps = {
        actions: hmsReactiveStore.getHMSActions(),
        store: create<HMSStore>(hmsReactiveStore.getStore()), // convert vanilla store in react hook
      };
    }
  }
  window.onunload = () => {
    providerProps.actions.leave();
  };

  return React.createElement(
    HMSContext.Provider,
    { value: providerProps },
    children,
  );
};

/*
UseHMSStore is a read only hook which can be passed a selector to read data.
The hook can only be used in a component if HMSRoomProvider is present in its ancestors.
 */
export const useHMSStore = makeHMSStoreHook(HMSContext);

/*
UseHMSActions is a write ony hook which can be used to dispatch actions.
 */
export const useHMSActions = () => {
  const HMSContextConsumer = useContext(HMSContext);
  if (!HMSContextConsumer) {
    throw new Error('HMSContext state variables are not set');
  }
  return HMSContextConsumer.actions;
};
