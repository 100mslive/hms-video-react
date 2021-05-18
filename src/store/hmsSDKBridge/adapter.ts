import {
  HMSPeer,
  HMSMessage,
  HMSTrack,
} from '../schema';

import * as sdkTypes from './sdkTypes';

export class SDKToHMS {
  static convertPeer(sdkPeer: sdkTypes.HMSPeer): Partial<HMSPeer> & Pick<HMSPeer, 'id'> {
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

  static convertTrack(sdkTrack: sdkTypes.HMSTrack): HMSTrack {
    return {
      id: sdkTrack.trackId,
      source: sdkTrack.source,
      type: sdkTrack.type,
      enabled: sdkTrack.enabled,
    }
  }

  static convertMessage(sdkMessage: sdkTypes.HMSMessage): Partial<HMSMessage> & Pick<HMSMessage, 'sender'> {
    return {
      sender: sdkMessage.sender,
      time: sdkMessage.time,
      type: sdkMessage.type,
      message: sdkMessage.message,
    }
  }
}
