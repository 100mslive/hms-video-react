import { IHMSStore } from './IHMSStore';

export default interface IHMSBridge {
  join(...args: any[]): void;
  leave(): void;

  toggleScreenShare(): void;

  sendMessage(message: string): void;

  toggleLocalAudio(mute: boolean): void;
  toggleLocalVideo(mute: boolean): void;

  getStore(): IHMSStore;
}

export interface HMSError {
  code: number;
  message: string;
}
