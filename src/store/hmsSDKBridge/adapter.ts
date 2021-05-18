import {
  HMSPeer,
  HMSRoom,
  HMSMessage,
  HMSTrack,
} from '../schema';

import * as sdkTypes from './sdkTypes';
import { HMSError } from '../IHMSBridge';

export class SDKToHMS {
  static convertPeer(sdkPeer: sdkTypes.HMSPeer): Partial<HMSPeer> {
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

  static convertSpeaker(sdkSpeaker: sdkTypes.HMSSpeaker): Partial<HMSPeer> {
    return {
      id: sdkSpeaker.peerId,
      audioLevel: sdkSpeaker.audioLevel
    }
  }

  static convertRoom(sdkRoom: sdkTypes.HMSRoom): HMSRoom {
    return {
      id: sdkRoom.id,
      name: sdkRoom.name,
      peers: sdkRoom.peers?.map(p => p.peerId),
      shareableLink: sdkRoom.shareableLink,
      hasWaitingRoom: sdkRoom.hasWaitingRoom
    }
  }

  static convertTrack(sdkTrack: sdkTypes.HMSTrack): HMSTrack {
    return {
      id: sdkTrack.trackId,
      source: sdkTrack.source,
      type: sdkTrack.type,
      muted: !sdkTrack.enabled,
    }
  }

  static convertMessage(sdkMessage: sdkTypes.HMSMessage): Partial<HMSMessage> {
    return {
      sender: sdkMessage.sender,
      time: sdkMessage.time,
      type: sdkMessage.type,
      message: sdkMessage.message,
    }
  }

  static convertError(sdkHMSError: sdkTypes.HMSException): HMSError {
    return {
      code: sdkHMSError.code,
      message: sdkHMSError.message
    }
  }
}

export class HMSToSDK {
  static convertMessage(hmsMessage: HMSMessage): sdkTypes.HMSMessage {
    return {
      sender: hmsMessage.sender,
      time: hmsMessage.time,
      type: hmsMessage.type,
      message: hmsMessage.message
    }
  }
}
