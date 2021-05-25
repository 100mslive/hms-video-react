import React, { Ref } from 'react';

export interface VideoCoreProps {
  className: string;
  internalRef: Ref<any>;
}

/*
Avoid putting any logic, state or more props here. This is a very lightweight catch all component
to separate out the core video element and memoize to avoid most flickering issues.
 */

const VideoCoreElement = ({ className, internalRef }: VideoCoreProps) => {
  return (
    <video
      ref={internalRef}
      muted={true}
      autoPlay
      playsInline
      className={className}
    ></video>
  );
};

export const VideoCore = React.memo(VideoCoreElement);
