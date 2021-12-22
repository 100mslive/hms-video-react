import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  HMSReactiveStore,
  HMSStore,
  HMSActions,
  HMSNotification,
  HMSNotifications,
  HMSInternalsStore,
  IStoreReadOnly,
  selectRoomState,
  HMSWebrtcInternals,
} from '@100mslive/hms-video-store';
import create, { EqualityChecker, StateSelector } from 'zustand';
import {
  HMSContextProviderProps,
  makeHMSStoreHook,
  hooksErrorMessage,
  makeHMSStatsStoreHook,
} from './storeHook';
import { isBrowser } from '../utils/is-browser';

export interface IHMSReactStore<S extends HMSStore | HMSInternalsStore>
  extends IStoreReadOnly<S> {
  <U>(selector: StateSelector<S, U>, equalityFn?: EqualityChecker<U>): U;
}
export interface HMSRoomProviderProps {
  actions?: HMSActions;
  store?: IHMSReactStore<HMSStore>;
  notifications?: HMSNotifications;
  webrtcInternals?: HMSWebrtcInternals;
  isHMSStatsOn?: boolean;
}

/**
 * only one context is being created currently. This would need to be changed if multiple
 * rooms have to be supported, where every room will have its own context, provider, store and actions.
 */
const HMSContext = createContext<HMSContextProviderProps | null>(null);

const errFn = () => {
  throw new Error('modifying store is not allowed');
};

let providerProps: HMSContextProviderProps;
export const HMSRoomProvider: React.FC<HMSRoomProviderProps> = ({
  children,
  actions,
  store,
  notifications,
  webrtcInternals,
  isHMSStatsOn = false,
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
      providerProps = {
        actions: hmsReactiveStore.getHMSActions(),
        store: create<HMSStore>({
          ...hmsReactiveStore.getStore(),
          // adding a dummy function for setstate and destroy because zustan'd create expects them
          // to be present but we don't expose them from the store.
          setState: errFn,
          destroy: errFn,
        }), // convert vanilla store in react hook
        notifications: hmsReactiveStore.getNotifications(),
      };

      if (isHMSStatsOn || webrtcInternals) {
        const hmsInternals: HMSWebrtcInternals =
          webrtcInternals || hmsReactiveStore.getWebrtcInternals();
        providerProps.statsStore = create<HMSInternalsStore>({
          getState: hmsInternals.getState,
          subscribe: hmsInternals.subscribe,
          setState: errFn,
          destroy: errFn,
        });
        providerProps.hmsInternals = hmsInternals;
      }
    }
  }

  useEffect(() => {
    if (isBrowser) {
      window.onunload = () => {
        providerProps.actions.leave();
      };
    }
  }, []);

  return React.createElement(
    HMSContext.Provider,
    { value: providerProps },
    children,
  );
};

/**
 * `useHMSStore` is a read only hook which can be passed a selector to read data.
 * The hook can only be used in a component if HMSRoomProvider is present in its ancestors.
 */
export const useHMSStore = makeHMSStoreHook(HMSContext);

export const useHMSStatsStore = makeHMSStatsStoreHook(HMSContext);

/**
 * `useHMSVanillaStore` is a read only hook which returns the vanilla HMSStore.
 * Usage:
 * ```
 * const hmsStore = useHMSVanillaStore();
 * const dominantSpeaker = hmsStore.getState(selectDominantSpeaker);
 * ```
 *
 * Note: There's no need to use the vanilla hmsStore in React components.
 * This is used in rare cases where the store needs to be accessed outside a React component.
 * For almost every case, `useHMSStore` would get the job done.
 */
export const useHMSVanillaStore = () => {
  const HMSContextConsumer = useContext(HMSContext);
  if (!HMSContextConsumer) {
    throw new Error(hooksErrorMessage);
  }

  return HMSContextConsumer.store;
};

/*
 * `useHMSActions` is a write ony hook which can be used to dispatch actions.
 */
export const useHMSActions = () => {
  const HMSContextConsumer = useContext(HMSContext);
  if (!HMSContextConsumer) {
    throw new Error(hooksErrorMessage);
  }
  return HMSContextConsumer.actions;
};

/**
 * `useHMSNotifications` is a read only hook which gives the latest notification(HMSNotification) received.
 */
export const useHMSNotifications = () => {
  const HMSContextConsumer = useContext(HMSContext);
  const [notification, setNotification] = useState<HMSNotification | null>(
    null,
  );

  if (!HMSContextConsumer) {
    throw new Error(hooksErrorMessage);
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

export const useHMSRTCPeerConnections = () => {
  const HMSContextConsumer = useContext(HMSContext);
  if (!HMSContextConsumer) {
    throw new Error(hooksErrorMessage);
  }

  const useStore = HMSContextConsumer.store;
  const roomState = useStore(selectRoomState);
  const [peerConnections, setPeerConnections] = useState<{
    publish?: RTCPeerConnection;
    subscribe?: RTCPeerConnection;
  }>({});

  useEffect(() => {
    if (roomState === 'Connected') {
      (async () => {
        const publish = await HMSContextConsumer.hmsInternals?.getPublishPeerConnection();
        const subscribe = await HMSContextConsumer.hmsInternals?.getSubscribePeerConnection();

        setPeerConnections({ publish, subscribe });
      })();
    }
  }, [roomState]);

  return peerConnections;
};
