import React, { useEffect, useState } from 'react';
import { withClasses } from '../../utils/styles';
import { Button } from '../TwButton';
import { combineClasses } from '../../utils';

interface Fields {
  username: string;
  roomId: string;
  role: string;
  endpoint: string;
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
    'flex justify-center bg-white dark:bg-black items-center w-screen h-screen text-gray-100 dark:text-white',
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
  /**
   * Initial values to be filled in the form.
   */
  initialValues?: Partial<Fields>;
  /**
   * Event handler for join button click.
   */
  submitOnClick: ({ username, roomId, role, endpoint }: Fields) => void;
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
  initialValues,
  submitOnClick,
  classes: extraClasses,
  defaultClasses,
}: StyledJoinProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const [username, setUserName] = useState(initialValues?.username || '');
  const [role, setRole] = useState(initialValues?.role || 'Student');
  const [roomId, setRoomId] = useState(
    initialValues?.roomId || '607d781cdcee704ca43cafb9',
  );
  const [endpoint, setEndpoint] = useState(initialValues?.endpoint || 'qa2-us');

  useEffect(() => {
    initialValues?.username && setUserName(initialValues.username);
    initialValues?.role && setRole(initialValues.role);
    initialValues?.roomId && setRoomId(initialValues.roomId);
    initialValues?.endpoint && setEndpoint(initialValues.endpoint);
  }, [initialValues]);

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
              value={initialValues?.username || username}
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
              value={initialValues?.roomId || roomId}
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
              value={initialValues?.role || role}
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
          <div className={combinedClasses?.inputName}>
            <span>Environment:</span>
          </div>
          <div className={combinedClasses?.inputFieldRoot}>
            <select
              name="endpoint"
              className={combinedClasses?.inputField}
              value={initialValues?.endpoint || endpoint}
              onChange={event => {
                setEndpoint(event.target.value);
              }}
            >
              <option value="qa2-us">qa2-us</option>
              <option value="qa-in2">qa-in2</option>
              <option value="prod-in2">prod-in2</option>
              <option value="dev-in2">dev-in2</option>
              <option value="100ms-grpc">100ms-grpc</option>
            </select>
          </div>
          <div className={combinedClasses?.joinRoot}>
            <Button
              variant={'emphasized'}
              onClick={() =>
                submitOnClick({
                  username,
                  roomId,
                  role,
                  endpoint: `https://${endpoint}.100ms.live/init`,
                })
              }
            >
              Join{' '}
            </Button>
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
