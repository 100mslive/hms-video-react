const getVideoTileLabel = (
  peerName: string,
  isLocal: boolean,
  videoSource: 'screen' | 'camera' | 'canvas'
) => {
  let label;
  if (isLocal) {
    if (videoSource === 'screen') label = 'Your Screen';
    else label = 'You';
  } else {
    if (videoSource === 'screen') label = `${peerName}'s Screen`;
    else label = peerName;
  }

  return label;
};

const closeMediaStream = (stream: MediaStream | undefined) => {
  if (!stream) {
    return;
  }
  if (MediaStreamTrack) {
    var tracks, i, len;

    if (stream.getTracks) {
      tracks = stream.getTracks();
      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }
    } else {
      tracks = stream.getAudioTracks();
      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }

      tracks = stream.getVideoTracks();
      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }
    }
  }
};

export { closeMediaStream, getVideoTileLabel };
