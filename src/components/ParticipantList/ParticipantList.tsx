import React from 'react';
import {
  AudioMuteButton,
  MuteListButton,
  SpotlightListButton,
} from '../MediaIcons';
import { DownCarret, MuteList, SpotlightList, UpCarret } from '../../icons';
import { Peer, Participant, MediaStreamWithInfo } from '../../types';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { AvatarList } from '../Avatar';
import Popper from '@material-ui/core/Popper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 50,
      maxHeight: 10,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
  }),
);

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 240,
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: 600,
    },
  }),
);

export interface ParticipantListProps {
  participantList: Array<Participant>;
}

export const ParticipantList = ({ participantList }: ParticipantListProps) => {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const classesPop = useStyle();
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
        className="text-gray-500 border-opacity-0 m-1.5 focus:outline-none  w-60 rounded-tl-lg rounded-tr-lg bg-gray-100 self-center p-1.5"
        onClick={handleClick}
      >
        {participantList.length} in room
        <span className="p-1">{open ? UpCarret : DownCarret}</span>
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <div
          className="w-60 max-h-100 overflow-y-auto rounded-bl-xl rounded-br-xl py-1.5 bg-gray-100 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          {Array.from(roles.keys()).map(role => {
            let list = roles.get(role) || [];
            return (
              <>
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
                      className="text-white group flex items-center space-x-2 px-3 py-2 text-base"
                      role="menuitem"
                      tabIndex={-1}
                      id="menu-item-3"
                      key={participant.peer.id}
                    >
                      <AvatarList label={participant.peer.displayName} />
                      <div className="flex justify-between">
                        {participant.peer.displayName}
                      </div>
                      <div className="flex flex-grow justify-end">
                        {participant.isAudioMuted && (
                          <AudioMuteButton
                            isAudioMuted={participant.isAudioMuted}
                          />
                        )}
                        {participant.isStarMarked && <SpotlightListButton />}
                      </div>
                    </a>
                  ))}
                </div>
              </>
            );
          })}
        </div>
      </Popper>
    </div>
  );
};

{
  /* <List dense={dense}>
            <ListSubheader>Teacher</ListSubheader>
                <ListItem>
                    <ListItemText primary="Teacher" />
                </ListItem>
              {generate(
                <ListItem>
                  <ListItemAvatar>
                    <AvatarList label="Siddhant Agarwal"/>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Single"
                  />
                  <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="mute" className="opacity-0 hover:opacity-100"> 
                      {MuteList}
                      {/* {MuteList} */
}
//         </IconButton>
//         <IconButton edge="end" aria-label="mute" className="opacity-0 hover:opacity-100">
//           {SpotlightList}
//         </IconButton>
//       </ListItemSecondaryAction>
//     </ListItem>,
//   )}
//    <ListItem>
//         <ListItemText primary="Student" />
//     </ListItem>
//     {generate(
//     <ListItem>
//       <ListItemAvatar>
//         <AvatarList label="Siddhant Agarwal"/>
//       </ListItemAvatar>
//       <ListItemText
//         primary="Single"
//       />
//       <ListItemSecondaryAction>
//         <MuteListButton/>
//         <SpotlightListButton/>
//       </ListItemSecondaryAction>
//     </ListItem>,
//   )}
// </List> */}
