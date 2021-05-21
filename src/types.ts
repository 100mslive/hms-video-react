import { HMSPeer, HMSTrack } from './store/schema';

//TODO match with HMSPeer interface
export interface MediaStreamWithInfo {
  videoTrack: MediaStreamTrack;
  audioTrack: MediaStreamTrack;
  hmsVideoTrack?: HMSTrack;
  peer: HMSPeer;
}
export type AudioLevelDisplayType = 'inline-wave' | 'inline-circle' | 'border';

export type ButtonDisplayType = 'circle' | 'rectangle';
