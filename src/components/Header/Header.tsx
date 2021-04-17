import React from 'react';
import { LogoButton } from '../MediaIcons';
import { Volume, Clock } from '../../icons';
import { Peer } from '../../types';

export interface HeaderProps {
  peer: Peer;
  time: number;
  classes?: {
    root?: string;
    clock?: string;
    center?: string;
  };
  leftComponents: Array<String>;
  centerComponents: Array<String>;
  rightComponents: Array<String>;
}

export const Header = ({
  peer,
  time,
  classes = {
    root: 'flex  lg:h-11 md:h-9 hidden md:flex p-3 text-white relative',
    clock: 'flex self-center items-center space-x-2 absolute',
    center: 'flex flex-grow justify-center self-center',
  },
  leftComponents = ['logo', 'timer'],
  centerComponents = ['label'],
  rightComponents = [],
}: HeaderProps) => {
  return (
    <div className={classes.root}>
      <div className={classes.clock}>
        {leftComponents.find(name => name === 'logo') != undefined && (
          <div>
            <LogoButton />
          </div>
        )}
        {leftComponents.find(name => name === 'timer') != undefined && (
          <div>{Clock}</div>
        )}
        {leftComponents.find(name => name === 'timer') != undefined && (
          <div>
            {parseInt((time / 60).toString())} m {time % 60} s
          </div>
        )}
      </div>

      <div className={classes.center}>
        {centerComponents.find(name => name === 'label') != undefined && (
          <div>
            {Volume} You, {peer.displayName}
          </div>
        )}
      </div>
    </div>
  );
};
