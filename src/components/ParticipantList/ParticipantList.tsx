import React from 'react';
import { MuteListButton, SpotlightListButton } from '../MediaIcons';
import {MuteList, SpotlightList} from '../../icons'
import {Peer, Participant} from '../../types'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { AvatarList } from '../Avatar';
import Popper from '@material-ui/core/Popper';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 50,
      maxHeight: 10
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
  teacherList: Array<Participant>;
  studentList: Array<Participant>;
}


export const ParticipantList = ({
  teacherList,
  studentList,
}: ParticipantListProps) => {
    const classes = useStyles();
    const [dense, setDense] = React.useState(false);
    const classesPop = useStyle();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;
  return (
    <div className="flex flex-grow justify-content:center border-opacity-0">
    <button aria-describedby={id} type="button" className="text-gray-500 border-opacity-0 mt-1.5 focus:outline-none pt-1.5 w-60 rounded-tl-lg rounded-tr-lg bg-gray-100 self-center px-3" onClick={handleClick}>
        {teacherList.length + studentList.length} in room
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
      <div className="w-60 max-h-100 overflow-y-auto rounded-bl-xl rounded-br-xl py-1.5 bg-gray-100 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
      <div role="none">
      <a href="#" className="text-gray-500 group flex items-center px-3 py-2 text-base" role="menuitem" tabIndex={-1}>
        Teachers
      </a>
      </div>
    <div role="none">
        {teacherList.map((teacher, index) => (
      <a href="#" className="text-white group flex items-center space-x-2 px-3 py-2 text-base" role="menuitem" tabIndex={-1} id="menu-item-0">
        <AvatarList label={teacher.peer.displayName} />
        <div>
            {teacher.peer.displayName}
        </div>
      </a> ))}
    </div>
    <div role="none">
      <a href="#" className="text-gray-500 group flex items-center px-3 py-2 text-base" role="menuitem" tabIndex={-1}>
        Students ({studentList.length})
      </a>
      </div>
    <div role="none">
     {studentList.map((student,index)=>(
      <a href="#" className="text-white group flex items-center space-x-2 px-3 py-2 text-base" role="menuitem" tabIndex={-1} id="menu-item-3">
      <AvatarList label={student.peer.displayName} />
            <div> {student.peer.displayName} </div>
        <div className="flex flex-grow justify-end right-0 absolute">
        <MuteListButton/>
        <SpotlightListButton/>
        </div>
      </a> 
      ))}
    </div>
    </div>
    </Popper>
    </div>
  );
};



{/* <List dense={dense}>
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
                      {/* {MuteList} */}
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