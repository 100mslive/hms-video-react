const closeMediaStream = function(stream: MediaStream) {
  if (!stream) {
    return;
  }
  if (
    MediaStreamTrack &&
    MediaStreamTrack.prototype &&
    MediaStreamTrack.prototype.stop
  ) {
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
    // Deprecated by the spec, but still in use.
  } else if (typeof stream.stop === 'function') {
    console.log('closeMediaStream() | calling stop() on the MediaStream');
    stream.stop();
  }
};

export { closeMediaStream };
