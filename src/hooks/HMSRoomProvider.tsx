import React, { createContext, useContext } from 'react';
import {
  IHMSBridge,
  HMSSDKBridge,
  IHMSStore,
  createNewStore,
} from '../store';
import { HMSSdk } from '@100mslive/hms-video';
import { HMSContextProviderProps, makeHMSStoreHook } from './storeHook';
import { IHMSStoreReadOnly } from '../store/IHMSStore';

// Data flow is unidirectional following flux. View never directly changes store, it calls an
// action function(eg. sendMessage, leave etc.) which in turns does the necessary action
// required and might modify the store if needed. View only reads from the store and shows it.

const store: IHMSStore = createNewStore();
const sdk: IHMSBridge = new HMSSDKBridge(new HMSSdk(), store);

const HMSContext = createContext<HMSContextProviderProps | null>(null);

export interface HMSRoomProviderProps {
  sdk?: IHMSBridge;
  store?: IHMSStoreReadOnly;
}

let providerProps: HMSContextProviderProps = { sdk, store };

export const HMSRoomProvider: React.FC<HMSRoomProviderProps> = ({ children, ...props }) => {
  if (props.sdk && props.store) {
    providerProps = {sdk: props.sdk, store: props.store}
  }
  window.onunload = () => {
    providerProps.sdk.leave();
  };
  return <HMSContext.Provider value={providerProps}>
    {children}
  </HMSContext.Provider>
};

/*
UseHMSStore is a read only hook which can be passed a selector to read data.
The hook can only be used in a component if HMSRoomProvider is present in its ancestors.
One HMSRoomProvider will need to be created per room in the UI.
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
  return HMSContextConsumer.sdk;
};
