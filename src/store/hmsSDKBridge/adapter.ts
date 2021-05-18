import {
  HMSPeer,
  HMSRoom,
  HMSMessage,
  HMSTrack,
} from '../schema';

import sdkHMSPeer from '@100mslive/100ms-web-sdk/dist/interfaces/hms-peer';
import sdkHMSRoom from '@100mslive/100ms-web-sdk/dist/interfaces/room';
import sdkHMSMessage from '@100mslive/100ms-web-sdk/dist/interfaces/message';
import sdkHMSTrack from '@100mslive/100ms-web-sdk/dist/media/tracks/HMSTrack';
import sdkHMSSpeaker from '@100mslive/100ms-web-sdk/dist/interfaces/speaker';
import sdkHMSException from '@100mslive/100ms-web-sdk/dist/error/HMSException';
import { HMSError } from '../IHMSBridge';

export class SDKToHMS {
  static convertPeer(sdkPeer: sdkHMSPeer): Partial<HMSPeer> {
    return {
      id: sdkPeer.peerId,
      name: sdkPeer.name,
      role: sdkPeer.role,
      isLocal: sdkPeer.isLocal,
      videoTrack: sdkPeer.videoTrack?.trackId,
      audioTrack: sdkPeer.audioTrack?.trackId,
      auxiliaryTracks: sdkPeer.auxiliaryTracks.map(t => t.trackId),
    }
  }

  static convertSpeaker(sdkSpeaker: sdkHMSSpeaker): Partial<HMSPeer> {
    return {
      id: sdkSpeaker.peerId,
      audioLevel: sdkSpeaker.audioLevel
    }
  }

  static convertRoom(sdkRoom: sdkHMSRoom): HMSRoom {
    return {
      id: sdkRoom.id,
      name: sdkRoom.name,
      peers: sdkRoom.peers?.map(p => p.peerId),
      shareableLink: sdkRoom.shareableLink,
      hasWaitingRoom: sdkRoom.hasWaitingRoom
    }
  }

  static convertTrack(sdkTrack: sdkHMSTrack): HMSTrack {
    return {
      id: sdkTrack.trackId,
      source: sdkTrack.source,
      type: sdkTrack.type,
      muted: !sdkTrack.enabled,
    }
  }

  static convertMessage(sdkMessage: sdkHMSMessage): Partial<HMSMessage> {
    return {
      sender: sdkMessage.sender,
      time: sdkMessage.time,
      type: sdkMessage.type,
      message: sdkMessage.message,
    }
  }

  static convertError(sdkHMSError: sdkHMSException): HMSError {
    return {
      code: sdkHMSError.code,
      message: sdkHMSError.message
    }
  }
}

export class HMSToSDK {
  static convertMessage(hmsMessage: HMSMessage): sdkHMSMessage {
    return {
      sender: hmsMessage.sender,
      time: hmsMessage.time,
      type: hmsMessage.type,
      message: hmsMessage.message
    }
  }
}
