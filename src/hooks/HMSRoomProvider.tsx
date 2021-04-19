import React, { useState, useContext, createContext, useEffect } from 'react';
import { HMSSdk } from '@100mslive/100ms-web-sdk';
import HMSUpdateListener from '@100mslive/100ms-web-sdk/dist/interfaces/update-listener';
import HMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';
import HMSConfig from '@100mslive/100ms-web-sdk/dist/interfaces/config';
import HMSRoomProps from './interfaces/HMSRoomProps';
import createListener from './helpers/createListener';

const sdk = new HMSSdk();

const HMSContext = createContext<HMSRoomProps | null>(null);

export const HMSRoomProvider: React.FC = (props) => {

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

export const useHMSRoom = (): HMSRoomProps => {
    const HMSContextConsumer = useContext(HMSContext);

    if (HMSContextConsumer === null) {
        throw new Error('HMSContext state variables are not set');
    }

    return HMSContextConsumer;
};