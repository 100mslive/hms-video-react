export interface IHMSBridge {
  join(...args: any[]): void;
  leave(): void;

  setScreenShareEnabled(enabled: boolean): void;
  sendMessage(message: string): void;

  setLocalAudioEnabled(enabled: boolean): void;
  setLocalVideoEnabled(enabled: boolean): void;

  attachVideo(trackID: string, videoElement: HTMLVideoElement): void;
  removeVideo(trackID: string, videoElement: HTMLVideoElement): void;

}

export interface HMSError {
  code: number;
  message: string;
}
