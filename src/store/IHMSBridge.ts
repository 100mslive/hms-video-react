export interface IHMSBridge {
  join(...args: any[]): void;
  leave(): void;

  toggleScreenShare(): void;

  sendMessage(message: string): void;

  setLocalAudioEnabled(enabled: boolean): void;
  setLocalVideoEnabled(enabled: boolean): void;

  addSink(trackID: string, videoElement: HTMLVideoElement): void;
  removeSink(trackID: string, videoElement: HTMLVideoElement): void;
}

export interface HMSError {
  code: number;
  message: string;
}
