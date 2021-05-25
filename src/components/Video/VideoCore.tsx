import React, { Ref } from 'react';

export interface VideoCoreProps {
  className: string;
  ref: Ref<any>;
}

/*
Avoid putting any logic, state or more props here. This is a very lightweight catch all component
to separate out the core video element and memoize to avoid most flickering issues.
 */

const VideoCoreElement = ({
  className,
  ref,
}: VideoCoreProps) => {
  return <video
    ref={ref}
    muted={true}
    autoPlay
    playsInline
    className={className}
  ></video>
}

export const VideoCore = React.memo(VideoCoreElement);
