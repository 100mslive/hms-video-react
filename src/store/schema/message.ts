import { HMSPeerID } from './peer';

export type HMSMessageID = string;
export type HMSMessageType = 'chat';

export interface HMSMessage {
  id: HMSMessageID;
  sender: HMSPeerID;
  time: Date;
  type: HMSMessageType;
  message: string;
}
