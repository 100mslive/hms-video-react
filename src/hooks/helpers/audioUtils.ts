import HMSSpeaker from '@100mslive/100ms-web-sdk/dist/interfaces/speaker';

export function areSpeakersApproxEqual(
  oldSpeakers: HMSSpeaker[],
  newSpeakers: HMSSpeaker[],
): boolean {
  if (oldSpeakers.length !== newSpeakers.length) {
    // number of peers changed
    return false;
  }
  const oldAudioLevels: { [k: string]: number } = oldSpeakers.reduce(
    (map: { [k: string]: number }, speaker) => {
      map[speaker.trackId] = speaker.audioLevel;
      return map;
    },
    {},
  );
  for (const newSpeaker of newSpeakers) {
    if (!(newSpeaker.trackId in oldAudioLevels)) {
      return false;
    }
    const oldAudioLevel = oldAudioLevels[newSpeaker.trackId] || 0;
    const newAudioLevel = newSpeaker.audioLevel || 0;
    const audioDiff = Math.abs(newAudioLevel - oldAudioLevel);
    if (audioDiff > 20) {
      return false;
    }
  }
  return true;
}
