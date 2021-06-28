import React from 'react';

//TODO replace with unpkg
export const Silence = () => {
  return (
    <audio
      src="https://100ms-website-100mslive.vercel.app//silence.mp3"
      autoPlay
      className="hidden"
    />
  );
};
