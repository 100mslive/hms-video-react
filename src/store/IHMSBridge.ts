import { HMSMessage } from './schema';
import { IHMSStore } from './IHMSStore';

export default interface IHMSBridge {
  join(...args: any[]): void;
  leave(): void;

  startScreenShare(): void;
  stopScreenShare(): void;

  sendMessage(message: HMSMessage): HMSMessage;

  toggleLocalAudio(mute: boolean): void;
  toggleLocalVideo(mute: boolean): void;

  getStore(): IHMSStore<any>;
}

export interface HMSError {
  code: number,
  message: string
}

