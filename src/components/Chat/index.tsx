import React from 'react';
import Popover from '@material-ui/core/Popover';
import { ChatIconWhite, ChatIconBlack } from '../../icons';
import { ChatBox, ChatProps } from '../ChatBox/ChatBox';

//TODO: Expose Popover material-ui props
//TODO: Allow developer some way to control width and height of chatbox
export default function Chat(args: ChatProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <button
        onClick={handleClick}
        className={`focus:outline-none rounded-lg ${open && 'bg-white'} p-3`}
      >
        {open ? ChatIconBlack : ChatIconWhite}
      </button>
      <Popover
        id={id}
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: window.innerHeight - 560,
          left: window.innerWidth - 100,
        }}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div style={{ height: '466px', width: '240px' }} className="flex">
          <ChatBox
            {...args}
            onClose={() => {
              handleClose();
            }}
          />
        </div>
      </Popover>
    </div>
  );
}
