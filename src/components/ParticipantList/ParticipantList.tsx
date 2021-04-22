import React from 'react';
import { MuteListButton, SpotlightListButton } from '../MediaIcons';
import { DownCarret, UpCarret } from '../../icons';
import { Participant } from '../../types';
import { AvatarList } from '../Avatar';
import Popper from '@material-ui/core/Popper';

export interface ParticipantListProps {
  participantList: Array<Participant>;
}

export const ParticipantList = ({ participantList }: ParticipantListProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  const roles = new Map<string, Participant[]>();
  participantList.forEach(participant => {
    let role = participant.peer.role || 'Audience';
    let list = roles.get(role) || [];
    list.push(participant);
    roles.set(role, list);
  });

  return (
    <div className="flex flex-grow justify-content:center border-opacity-0">
      <button
        aria-describedby={id}
        type="button"
        className={`text-gray-500 flex border-opacity-0 focus:outline-none w-60 pt-1.5 mb-1 rounded-tl-lg rounded-tr-lg ${
          open ? 'bg-gray-100' : 'bg-black'
        } self-center px-3`}
        onClick={handleClick}
      >
        <div className="flex flex-grow justify-center px-3 tracking-wide self-center">
          {participantList.length} in room
          <span className="pl-2 self-center">
            {open ? UpCarret : DownCarret}
          </span>
        </div>
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <div
          className="w-60 max-h-100 overflow-y-auto rounded-bl-xl rounded-br-xl py-1.5 bg-gray-100 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          {Array.from(roles.keys()).map((role,index) => {
            let list = roles.get(role) || [];
            return (
              <div key={index}>
                <div role="none" key={role}>
                  <a
                    href="#"
                    className="text-gray-500 group flex items-center px-3 py-2 text-base"
                    role="menuitem"
                    tabIndex={-1}
                  >
                    {role} ({roles.get(role)?.length})
                  </a>
                </div>
                <div role="none">
                  {list.map((participant, index) => (
                    <a
                      href="#"
                      className="text-white group flex items-center space-x-2 px-3 py-2 text-base hover:bg-gray-200"
                      role="menuitem"
                      tabIndex={-1}
                      id="menu-item-3"
                      key={index}
                    >
                      <AvatarList label={participant.peer.displayName} />
                      <div className="flex justify-between">
                        {participant.peer.displayName}
                      </div>
                      <div className="flex flex-grow justify-end right-0 absolute">
                        <MuteListButton isMuteOn={participant.isAudioMuted} />
                        <SpotlightListButton
                          isSpotlightOn={participant.isStarMarked}
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Popper>
    </div>
  );
};
