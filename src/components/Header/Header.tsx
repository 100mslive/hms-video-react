import React from 'react';
import { LogoButton } from '../MediaIcons';
import { Volume, Clock } from '../../icons';
import { Participant, Peer } from '../../types';
import {ParticipantList} from '../ParticipantList'

export interface HeaderProps {
  peer: Peer;
  time: number;
  classes?: {
    root?: string;
    leftRoot?: string;
    centerRoot?: string;
    rightRoot?: string;
  };
  leftComponents: Array<React.ReactNode>;
  centerComponents: Array<React.ReactNode>;
  rightComponents: Array<React.ReactNode>;
  // leftComponents: Array<String>;
  // centerComponents: Array<String>;
  // rightComponents: Array<String>;
}
const participants = [
  {
    peer: { id: '123', displayName: 'Alex Tinmayson', role: 'Teacher' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Ankita Bhattacharya', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Anshul Kumar', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Ishaan Awasthi', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Ivy Loppinbug', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
  {
    peer: { id: '123', displayName: 'Sudhanshu Kumar', role: 'Student' },
    isAudioMuted: false,
    isStarMarked: false,
  },
]
export const Header = ({
  peer,
  time,
  classes = {
    root:
      'flex flex-grow h-7.5 items-center p-3 relative gap-x-4 self-center justify-center',
    leftRoot:
      'flex md:flex-none md:self-center md:justify-center md:left-0 md:ml-2 md:absolute',
    centerRoot:
      'flex md:flex-grow gap-x-4 md:mr-2 md:self-center md:justify-center',
    rightRoot:
      'flex md:flex-none md:right-0 md:absolute md:self-center md:p-3 md:mr-5',
  },
  leftComponents = [<LogoButton />],
  centerComponents = [],
  rightComponents = [],
}: HeaderProps) => {
  return (
    <div className={classes.root}>
      <div className={classes.leftRoot}>
          {leftComponents}
      </div>
      <div className={classes.rightRoot}>
          {/* <div> */}
          {rightComponents}
            {/* <ParticipantList participantList={Participants} /> */}
          {/* </div> */}
          </div>
      </div>
  );
};