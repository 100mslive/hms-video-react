import React, { useCallback } from 'react';
import { AudioLevelIndicatorProps } from '.';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { sigmoid } from '../../utils';
export interface AudioLevelIndicatorClasses {
  /**
   * Style attached to avatar
   */
  root?: string;
  /**
   * Style attached when display shape is circle
   */
  videoCircle?: string;
}

type AudioLevelBorderProps = Omit<AudioLevelIndicatorProps, 'type'>;

const defaultClasses: AudioLevelIndicatorClasses = {
  root: 'w-full h-full absolute left-0 top-0 rounded-lg',
  videoCircle: 'rounded-full',
};

export const AudioLevelBorder = ({
  level,
  color = '#0F6CFF',
  displayShape,
  classes,
}: AudioLevelBorderProps) => {
  const hu = useCallback(
    hmsUiClassParserGenerator<AudioLevelIndicatorClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-audioLevelBorder',
    }),
    [],
  );
  const borderStyle = {
    transition: 'box-shadow 0.4s ease-in-out',
    boxShadow: level
      ? `0px 0px ${24 * sigmoid(level)}px ${color}, 0px 0px ${16 *
          sigmoid(level)}px ${color}`
      : '',
  };
  return (
    <div
      className={`${hu('root')} ${
        displayShape === 'circle' ? hu('videoCircle') : ''
      }
        `}
      style={borderStyle}
    ></div>
  );
};
