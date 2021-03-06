import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Button';
import { VolumeIcon } from '../Icons';
import { Text } from '../Text';

const TEST_AUDIO_URL = 'https://100ms.live/test-audio.wav';

const TestAudio = ({ outputDeviceId }: { outputDeviceId?: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current && outputDeviceId) {
      try {
        audioRef.current
          // @ts-ignore
          .setSinkId(outputDeviceId)
          .then(() =>
            console.log('Playing test audio through', outputDeviceId),
          );
      } catch (error) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef.current, outputDeviceId]);

  return (
    <>
      <audio
        ref={audioRef}
        src={TEST_AUDIO_URL}
        onEnded={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      ></audio>

      <Button
        onClick={() => audioRef.current?.play().catch(console.error)}
        disabled={playing}
      >
        {playing ? (
          <>
            <Text>Playing</Text>
            <VolumeIcon height="1.2rem" />
          </>
        ) : (
          <Text>Play</Text>
        )}
      </Button>
    </>
  );
};

export default TestAudio;
