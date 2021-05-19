import React, { createContext, createElement, useContext } from 'react';
import {
  IHMSBridge,
  HMSSDKBridge,
  IHMSStore,
  HMSStore,
  createNewStore,
} from '../store';
import { HMSSdk } from '@100mslive/100ms-web-sdk';
import { EqualityChecker, StateSelector } from 'zustand';

// Data flow is unidirectional following flux. View never directly changes store, it calls an
// action function(eg. sendMessage, leave etc.) which in turns does the necessary action
// required and might modify the store if needed. View only reads from the store and shows it.

interface HMSRoomProviderProps {
  sdk: IHMSBridge; // for actions which may also mutate store
  store: Omit<IHMSStore, 'setState'>; // readonly store, don't mutate this
}

const store: IHMSStore = createNewStore();
const sdk: IHMSBridge = new HMSSDKBridge(new HMSSdk(), store);

const HMSContext = createContext<HMSRoomProviderProps | null>(null);
const providerProps = { sdk, store }; // don't do it in component to fix reference

export const HMSRoomProvider: React.FC = ({ children }) => {
  window.onunload = () => {
    sdk.leave();
  };
  return createElement(HMSContext.Provider, { value: providerProps }, children);
};

/*
UseHMSStore is a read only hook which can be passed a selector to read data.
The hook can only be used in a component if HMSRoomProvider is present in its ancestors.
One HMSRoomProvider will need to be created per room in the UI.
 */
export const useHMSStore = <StateSlice>(
  selector: StateSelector<HMSStore, StateSlice>,
  equalityFn: EqualityChecker<StateSlice> = Object.is,
) => {
  const HMSContextConsumer = useContext(HMSContext);
  if (!HMSContextConsumer) {
    throw new Error('HMSContext state variables are not set');
  }
  const useStore = HMSContextConsumer.store as IHMSStore;
  return useStore(selector, equalityFn);
};

/*
UseHMSActions is a write ony hook which can be used to dispatch actions.
 */
export const useHMSActions = <StateSlice>() => {
  const HMSContextConsumer = useContext(HMSContext);
  if (!HMSContextConsumer) {
    throw new Error('HMSContext state variables are not set');
  }
  return HMSContextConsumer.sdk;
};
