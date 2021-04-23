import HMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import React, { ReactNodeArray } from 'react';
import { VideoTile, VideoTileProps } from '../VideoTile';

export interface PreviewProps extends VideoTileProps {
  peers: HMSPeer[];
  roomName: string;
  joinOnClick: () => void;
  goBackOnClick: () => void;
}

export const Preview = ({
  peers,
  roomName,
  joinOnClick,
  goBackOnClick,
}: PreviewProps) => {
  const localPeer =
    peers && peers.length > 0 && peers[0]
      ? peers.filter(peer => peer.isLocal)[0]
      : false;
  let teachers = null;

  const filteredPeers =
    peers &&
    peers.length > 0 &&
    peers[0] &&
    peers.filter(peer => peer.customerDescription != '');

  if (filteredPeers && filteredPeers.length > 0 && filteredPeers[0]) {
    if (filteredPeers.length === 1) {
      teachers = <span className="mb-4 text-sm">{`You`}</span>;
    } else {
      teachers = filteredPeers.map((peer, idx) => (
        <span key={idx} className="mb-4 text-sm">
          {!peer.isLocal ? `${peer.name}, ` : `and you.`}
        </span>
      ));
    }
  }

  return localPeer ? (
    <div className="flex flex-col w-37.5 h-42.5 bg-gray-100 items-center justify-center overflow-auto text-white rounded-2xl">
      <div className="w-22.5 h-22.5">
        <VideoTile
          // @ts-ignore
          stream={window.navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          })}
          peer={{
            id: localPeer.peerId,
            displayName: localPeer.name,
          }}
          objectFit="contain"
          isLocal={true}
          //@ts-ignore
          // classes={{root: "'w-full h-full flex relative items-center justify-center rounded-lg"}}
        />
      </div>
      <div className="mt-5 text-xl mb-2">Hello, {localPeer.name}</div>
      <div className="mb-2 text-md">Welcome to {roomName}</div>
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="mr-3">Teachers: </div>
        <div>{teachers}</div>
      </div>
      <div
        className="flex justify-center items-center mb-4 bg-blue-main w-28 h-28 max-h-28 rounded-lg text-md cursor-pointer"
        onClick={joinOnClick}
      >
        Join
      </div>
      <div
        className="mb-8 text-blue-main text-md cursor-pointer"
        onClick={goBackOnClick}
      >
        Go back
      </div>
    </div>
  ) : null;
};
