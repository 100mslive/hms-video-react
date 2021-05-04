import React from 'react';
import { LogoButton, SpeakerTag } from '../MediaIcons';
import { Participant, Peer } from '../../types';

export interface HeaderProps {
  peer: Peer;
  time: number;
  speaker: string;
  classes?: {
    root?: string;
    leftRoot?: string;
    centerRoot?: string;
    rightRoot?: string;
  };
  leftComponents: Array<React.ReactNode>;
  centerComponents: Array<React.ReactNode>;
  rightComponents: Array<React.ReactNode>;
}

export const Header = ({
  peer,
  time,
  speaker,
  classes = {
    root:
      'flex flex-grow h-7.5 items-center p-2 relative gap-x-4 self-center justify-center',
    leftRoot:
      'flex md:flex-none md:self-center md:justify-center md:left-0 md:ml-2 md:absolute',
    centerRoot:
      'md:flex md:flex-grow md:mr-2 md:self-center md:justify-center hidden md:visible',
    rightRoot:
      'flex md:flex-none md:right-0 md:absolute md:self-center md:p-3 md:mr-5',
  },
  leftComponents = [<LogoButton key={0} />],
  centerComponents = [<SpeakerTag name={speaker} key={0} />],
  rightComponents = [],
}: HeaderProps) => {
  const teacher = Array<Participant>();
  const student = Array<Participant>();
  teacher.push({
    peer: { id: '123', displayName: 'Sanjana Ma`am (You)' },
    isAudioMuted: false,
    isStarMarked: false,
  });
  student.push({
    peer: { id: '123', displayName: 'Alex Tinmayson' },
    isAudioMuted: false,
    isStarMarked: false,
  });
  student.push({
    peer: { id: '123', displayName: 'Ankita Bhattacharya ' },
    isAudioMuted: false,
    isStarMarked: false,
  });
  return (
    <div style={{ padding: '10px 0px 0px 0px', height: '10%' }}>
      <div className={classes.root}>
        <div className={classes.leftRoot}>{leftComponents}</div>
        <div className={classes.centerRoot}>{centerComponents}</div>
        <div className={classes.rightRoot}>{rightComponents}</div>
      </div>
    </div>
  );
};
