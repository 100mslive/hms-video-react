import React from 'react';
import { AudioLevelIndicatorProps } from '.';
export type AudioLevelProps = Omit<AudioLevelIndicatorProps, 'type'>;

const AudioLevelBorder = ({
  level,
  color = '#0F6CFF',
  displayShape,
  classes = {
    root: 'w-full h-full absolute left-0 top-0 rounded-lg',
    videoCircle: 'rounded-full',
  },
}: AudioLevelProps) => {
  return (
    <div
      className={`${classes.root} ${
        displayShape === 'circle' ? classes.videoCircle : ''
      }
        `}
      style={
        level
          ? {
              boxShadow: `0px 0px ${0.12 * level}px ${color}, 0px 0px ${0.8 *
                level}px ${color}`,
            }
          : {}
      }
    ></div>
  );
};

export default AudioLevelBorder;
