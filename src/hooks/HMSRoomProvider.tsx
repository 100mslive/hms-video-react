import React, { useState, useContext, createContext, useEffect } from 'react';
import HMSSdk from '@100mslive/100ms-web-sdk';
import HMSUpdateListener from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import HMSRoom from '@100mslive/100ms-web-sdk/dist/interfaces/room';
import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import HMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';
import HMSException from '@100mslive/100ms-web-sdk/dist/error/HMSException';
import HMSConfig from '@100mslive/100ms-web-sdk/dist/interfaces/config';

interface Props {
    peers: HMSPeer[];
    localPeer: HMSPeer;
    join: (config: HMSConfig, listener: HMSUpdateListener) => void;
    leave: () => void;
    toggleMute: (track: HMSTrack) => void;
};

const createListener = (
    incomingListener: HMSUpdateListener,
    setPeers: any,
    setLocalPeer: any,
    sdk: HMSSdk
) => {
    const myListener = {
        onJoin: (room: HMSRoom) => {
            console.log("INSIDE MY LISTENER ONJOIN");

            setPeers(sdk.getPeers());
            setLocalPeer(sdk.getLocalPeer());
            incomingListener.onJoin(room);
        },

        onPeerUpdate: (type: any, peer: HMSPeer) => {
            console.log("INSIDE MY LISTENER ONPEERUPDATE");

            setPeers(sdk.getPeers());
            incomingListener.onPeerUpdate(type, peer);
        },

        onRoomUpdate: (type: any, room: HMSRoom) => { 
            console.log("INSIDE MY LISTENER ONROOMUPDATE");
        },

        onTrackUpdate: (type: any, track: HMSTrack, peer: HMSPeer) => {
            console.log("INSIDE MY LISTENER ONTRACKUPDATE");

            incomingListener.onTrackUpdate(type, track, peer);
        },

        onError: (exception: HMSException) => {
            console.log("INSIDE MY LISTENER ONERROR");

            incomingListener.onError(exception);
        },
    };

    return myListener;
};

const sdk = new HMSSdk();

const HMSContext = createContext<Props | null>(null);

export const HMSRoomProvider = (props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {

    const [peers, setPeers] = useState(sdk.getPeers());

    const [localPeer, setLocalPeer] = useState(sdk.getLocalPeer());

    const join = (config: HMSConfig, listener: HMSUpdateListener) => {
        sdk.join(config, createListener(listener, setPeers, setLocalPeer, sdk));
    };

    const leave = () => {
        sdk.leave();
    };

    const toggleMute = (track: HMSTrack) => {
        track.setEnabled(!track.enabled);
    };

    window.onunload = () => {
        leave();
    };
    
    return (
        <HMSContext.Provider
            value={{
                peers: peers,
                localPeer: localPeer,
                join: join,
                leave: leave,
                toggleMute: toggleMute,
            }}
        >
            {props.children}
        </HMSContext.Provider>
    );
};

export const useHMSRoom = () => {
    const HMSContextConsumer = useContext(HMSContext);

    if (HMSContextConsumer === null) {
        throw new Error('HMSContext state variables are not set');
    }

    return HMSContextConsumer;
};