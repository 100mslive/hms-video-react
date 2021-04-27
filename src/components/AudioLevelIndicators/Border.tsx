import React from 'react';
import { StyledAudioLevelIndicatorProps, AudioLevelIndicatorClasses } from '.';
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';
//@ts-ignore
import { create } from 'twind';

type StyledAudioLevelBorderProps = Omit<StyledAudioLevelIndicatorProps, 'type'>;
type AudioLevelBorderClasses = AudioLevelIndicatorClasses;

const defaultClasses: AudioLevelIndicatorClasses = {
  root: 'w-full h-full absolute left-0 top-0 rounded-lg',
  videoCircle: 'rounded-full',
};

const StyledAudioLevelBorder = ({
  level,
  color = '#0F6CFF',
  displayShape,
  classes: extraClasses,
  defaultClasses,
}: StyledAudioLevelBorderProps) => {
  //TODO this is overlapping a lot with the previous component. Combine
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  return (
    <div
      className={`${combinedClasses?.root} ${
        displayShape === 'circle' ? combinedClasses?.videoCircle : ''
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

export type AudioLevelBorderProps = Omit<
  StyledAudioLevelBorderProps,
  'defaultClasses'
>;

export const AudioLevelBorder = withClasses<
  AudioLevelBorderClasses | undefined
>(
  defaultClasses,
  'audioLevelBorder',
  create().tw,
)<StyledAudioLevelBorderProps>(StyledAudioLevelBorder);
