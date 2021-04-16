import React from 'react';
import { LogoButton } from '../MediaIcons';
import { Volume, Clock } from '../../icons';
import {Peer} from '../../types';

export interface HeaderProps{
  peer: Peer,
  time: number,
  classes?: {
    root?: string,
    clock?: string,
    label?: string
  } 
}

export const Header = ({
  peer,
  time,
  classes = {
    root: "flex h-full hidden md:flex p-3 m-1 text-white relative",
    clock: "flex flex-none self-center items-center space-x-2 absolute",
    label: "flex flex-grow justify-center self-center"
  }
}:HeaderProps) => {

  return (
    <div className={classes.root}>
        <div className={classes.clock}>
          <div><LogoButton/></div>
          <div>{Clock}</div>
          <div>{parseInt((time/60).toString())} m {time%60} s</div>
        </div>
        <div className={classes.label}>
          {Volume} You, {peer.displayName}
        </div>
    </div>
  );
};
