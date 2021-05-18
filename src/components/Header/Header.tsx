import React,{useCallback} from 'react';
import { Participant, Peer } from '../../types';
import { Button } from '../TwButton';
import { VolumeIcon, Logo } from '../Icons';
import { hmsUiClassParserGenerator } from '../../utils/classes';

export interface HeaderClasses {
  root?: string;
  leftRoot?: string;
  centerRoot?: string;
  rightRoot?: string;
}
export interface HeaderProps {
  peer: Peer;
  time: number;
  speaker: string;
  leftComponents: Array<React.ReactNode>;
  centerComponents: Array<React.ReactNode>;
  rightComponents: Array<React.ReactNode>;
  classes?: HeaderClasses;
}

const defaultClasses: HeaderClasses = {
  root:
    'flex flex-grow bg-white dark:bg-black h-7.5 items-center p-2 relative gap-x-4 self-center justify-center ',
  leftRoot:
    'flex md:flex-none md:self-center md:justify-center md:left-0 md:ml-2 md:absolute',
  centerRoot:
    'md:flex md:flex-grow md:mr-2 md:self-center md:justify-center hidden md:visible dark:text-white text-gray-100',
  rightRoot:
    'flex md:flex-none md:right-0 md:absolute md:self-center md:p-3 md:mr-5',
};

export const Header = ({
  peer,
  time,
  speaker,
  leftComponents = [
    <Button variant={'no-fill'} size={'lg'}>
      <Logo />{' '}
    </Button>,
  ],
  centerComponents = [
    <Button variant={'no-fill'}>
      <VolumeIcon className="mr-2" />
      {speaker}
    </Button>,
  ],
  rightComponents = [],
  classes,
}: HeaderProps) => {
  const hu = useCallback(
    hmsUiClassParserGenerator<HeaderClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-header',
    }),
    [],
  );

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
    <div style={{ padding: '10px 0px 0px 0px', maxHeight: '10%' }}>
      <div className={hu('root')}>
        <div className={hu('leftRoot')}>{leftComponents}</div>
        <div className={hu('centerRoot')}>{centerComponents}</div>
        <div className={hu('rightRoot')}>{rightComponents}</div>
      </div>
    </div>
  );
};