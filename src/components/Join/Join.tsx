import React, { useState } from 'react';
import { withClasses } from '../../utils/styles';

//@ts-ignore
import { create } from 'twind';

import { combineClasses } from '../../utils';

interface User {
  username: String;
  roomId: String;
  role: String;
}

interface JoinClasses {
  root?: string;
  containerRoot?: string;
  header?: string;
  inputRoot?: string;
  inputName?: string;
  inputFieldRoot?: string;
  inputField?: string;
  joinRoot?: string;
  joinButton?: string;
}
const defaultClasses: JoinClasses = {
  root:
    'flex justify-center bg-white dark:bg-gray-200 items-center w-screen h-screen text-gray-100 dark:text-white',
  containerRoot:
    'bg-gray-600 dark:bg-gray-100 w-1/2 m-2 p-3 rounded-lg divide-solid',
  header: 'text-2xl mb-3 p-3 border-b-2',
  inputRoot: 'flex flex-wrap text-lg',
  inputName: 'w-1/3 flex justify-end items-center',
  inputFieldRoot: 'p-2 w-2/3',
  inputField: 'rounded-lg bg-white dark:bg-gray-200 w-full p-1',
  joinRoot: 'w-full flex justify-end m-2',
  joinButton:
    'bg-brand-main text-white rounded-lg px-5 py-2 focus:outline-none',
};
interface StyledJoinProps {
  submitOnClick: ({ username, roomId, role }: User) => void;
  /**
   * default classes
   */
  defaultClasses?: JoinClasses;
  /**
   * extra classes added  by user
   */
  classes?: JoinClasses;
}

const StyledJoin = ({
  submitOnClick,
  classes: extraClasses,
  defaultClasses,
}: StyledJoinProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [username, setUserName] = useState('');
  const [role, setRole] = useState('Teacher');
  const [roomId, setRoomId] = useState('607d781cdcee704ca43cafb9');

  return (
    <div className={combinedClasses?.root}>
      <div className={combinedClasses?.containerRoot}>
        <div className={combinedClasses?.header}>Join your class</div>

        <div className={combinedClasses?.inputRoot}>
          <div className={combinedClasses?.inputName}>
            <span>Username:</span>
          </div>
          <div className={combinedClasses?.inputFieldRoot}>
            <input
              className={combinedClasses?.inputField}
              value={username}
              onChange={event => {
                setUserName(event.target.value);
              }}
            ></input>
          </div>
          <div className={combinedClasses?.inputName}>
            <span>RoomId:</span>
          </div>
          <div className={combinedClasses?.inputFieldRoot}>
            <input
              className={combinedClasses?.inputField}
              value={roomId}
              onChange={event => {
                setRoomId(event.target.value);
              }}
            ></input>
          </div>
          <div className={combinedClasses?.inputName}>
            <span>Role:</span>
          </div>
          <div className={combinedClasses?.inputFieldRoot}>
            <select
              name="role"
              className={combinedClasses?.inputField}
              value={role}
              onChange={event => {
                setRole(event.target.value);
              }}
            >
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div className={combinedClasses?.joinRoot}>
            <button
              className={combinedClasses?.joinButton}
              onClick={() => submitOnClick({ username, roomId, role })}
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export type JoinProps = Omit<StyledJoinProps, 'defaultClasses'>;

export const Join = withClasses<JoinClasses | undefined>(
  defaultClasses,
  'join',
)<StyledJoinProps>(StyledJoin);
