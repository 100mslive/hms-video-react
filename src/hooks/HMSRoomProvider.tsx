import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  HMSReactiveStore,
  HMSStore,
  IHMSActions,
  HMSNotification,
  IHMSNotifications,
  IHMSStoreReadOnly,
} from '@100mslive/hms-video-store';
import create, { EqualityChecker, StateSelector } from 'zustand';
import { HMSContextProviderProps, makeHMSStoreHook } from './storeHook';

export interface IHMSReactStore extends IHMSStoreReadOnly {
  <U>(selector: StateSelector<HMSStore, U>, equalityFn?: EqualityChecker<U>): U;
}
export interface HMSRoomProviderProps {
  actions?: IHMSActions;
  store?: IHMSReactStore;
  notifications?: IHMSNotifications;
}

/**
 * only one context is being created currently. This would need to be changed if multiple
 * rooms have to be supported, where every room will have its own context, provider, store and actions.
 */
const HMSContext = createContext<HMSContextProviderProps | null>(null);

let providerProps: HMSContextProviderProps;
export const HMSRoomProvider: React.FC<HMSRoomProviderProps> = ({
  children,
  actions,
  store,
  notifications,
}) => {
  if (!providerProps) {
    if (actions && store) {
      providerProps = {
        actions: actions,
        store: store,
      };
      if (notifications) {
        providerProps.notifications = notifications;
      }
    } else {
      const hmsReactiveStore = new HMSReactiveStore();
      // adding a dummy function for setstate and destroy because zustan'd create expects them
      // to be present but we don't expose them from the store.
      const errFn = () => {
        throw new Error('modifying store is not allowed');
      };
      providerProps = {
        actions: hmsReactiveStore.getHMSActions(),
        store: create<HMSStore>({
          ...hmsReactiveStore.getStore(),
          setState: errFn,
          destroy: errFn,
        }), // convert vanilla store in react hook
        notifications: hmsReactiveStore.getNotifications(),
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
    const error =
      'It seems like you forgot to add your component within a top level HMSRoomProvider, please refer' +
      'to 100ms react docs to check on the required steps for using this hook.';
    throw new Error(error);
  }
  return HMSContextConsumer.actions;
};

export const useHMSNotifications = () => {
  const HMSContextConsumer = useContext(HMSContext);
  const [notification, setNotification] = useState<HMSNotification | null>(
    null,
  );

  if (!HMSContextConsumer) {
    const error =
      'It seems like you forgot to add your component within a top level HMSRoomProvider, please refer' +
      'to 100ms react docs to check on the required steps for using this hook.';
    throw new Error(error);
  }

  useEffect(() => {
    if (!HMSContextConsumer.notifications) {
      return;
    }
    const unsubscribe = HMSContextConsumer.notifications.onNotification(
      (notification: HMSNotification) => setNotification(notification),
    );
    return unsubscribe;
  }, [HMSContextConsumer.notifications]);

  return notification;
};
