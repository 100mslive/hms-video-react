export const initAudioSink = () => {
  const audioSink = document.createElement('div');
  // TODO rename random
  audioSink.id = 'audio-sink';
  document.body.append(audioSink);
};

export const addAudioTrack = ({ track }: { track: MediaStreamTrack }) => {
  const audioEl = document.createElement('audio');
  audioEl.autoplay = true;
  audioEl.style.display = 'none';
  audioEl.id = track.id;
  audioEl.srcObject = new MediaStream([track]);
  // TODO is this even needed?
  document.getElementById('audio-sink')?.append(audioEl);
};

export const removeAudioTrack = ({ track }: { track: MediaStreamTrack }) => {
  document.getElementById(track.id)?.remove();
};
