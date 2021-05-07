import React from 'react';
import Popover from '@material-ui/core/Popover';
import { ChatIcon } from '../../icons';
import { ChatBox, ChatProps } from '../ChatBox/ChatBox';
import { Button } from '../Button';

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
      <Button onClick={handleClick}>
        {open ? (
          <ChatIcon className="text-gray-700" />
        ) : (
          <ChatIcon className="text-white" />
        )}
      </Button>
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
