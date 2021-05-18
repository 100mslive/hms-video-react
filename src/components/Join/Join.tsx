import React, { useEffect, useState, useCallback } from 'react';
import { resolveClasses } from '../../utils/classes';
import {Select} from '../Select';
import {Input} from '../Input';
import { Button } from '../TwButton';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { hmsUiClassParserGenerator } from '../../utils/classes';

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
    'flex bg-white dark:bg-black justify-center items-center w-screen h-screen ',
  containerRoot:
    'bg-white dark:bg-gray-100 text-gray-100 dark:text-white w-1/2 m-2 p-3 rounded-xl divide-solid shadow-2 dark:shadow-none',
  header: 'text-2xl mb-3 p-3 border-b-2 border-gray-600 dark:border-gray-200',
  inputRoot: 'flex flex-wrap text-lg',
  inputName: 'w-1/3 flex justify-end items-center text-gray-100 dark:text-gray-500 pr-8',
  inputFieldRoot: 'p-2 w-2/3',
  inputField: 'rounded-lg bg-gray-700 dark:bg-gray-200 w-full p-1',
  joinRoot: 'w-full flex justify-end m-2',
  joinButton: 'bg-brand-main  rounded-lg px-5 py-2 focus:outline-none',
};
export interface JoinProps extends React.DetailsHTMLAttributes<any>{
  /**
   * Initial values to be filled in the form.
   */
  initialValues?: Partial<Fields>;
  /**
   * Event handler for join button click.
   */
  submitOnClick: ({ username, roomId, role, endpoint }: Fields) => void;
  /**
   * extra classes added  by user
   */
  classes?: { [key: string]: string } | JoinClasses;
}

export const Join = ({
  initialValues,
  submitOnClick,
  classes,
  ...props
}: JoinProps) => {
  const parseClass = useCallback(
    hmsUiClassParserGenerator<JoinClasses>({
      classes,
      defaultClasses,
      tag: 'hmsui-join',
    }),
    [],
  );

  const finalClasses: JoinClasses = resolveClasses(
    classes || {},
    defaultClasses,
  );
  const [username, setUserName] = useState(initialValues?.username || '');
  const [role, setRole] = useState(initialValues?.role || 'Student');
  const [roomId, setRoomId] = useState(
    initialValues?.roomId || '607d781cdcee704ca43cafb9',
  );
  const [endpoint, setEndpoint] = useState(initialValues?.endpoint || 'qa2-us');

  const { tw } = useHMSTheme();

  useEffect(() => {
    initialValues?.username && setUserName(initialValues.username);
    initialValues?.role && setRole(initialValues.role);
    initialValues?.roomId && setRoomId(initialValues.roomId);
    initialValues?.endpoint && setEndpoint(initialValues.endpoint);
  }, [initialValues]);

  return (
    <div className={parseClass('root')} {...props}>
      <div className={parseClass('containerRoot')}>
        <div className={parseClass('header')}>Join your class</div>
        <div className={parseClass('inputRoot')}>
          <div className={parseClass('inputName')}>
            <span>Username</span>
          </div>
          <div className={parseClass('inputFieldRoot')}>
            <Input
              compact
              value={initialValues?.username || username}
              onChange={event => {
                setUserName(event.target.value);
              }}
            ></Input>
          </div>
          <div className={parseClass('inputName')}>
            <span>RoomId</span>
          </div>
          <div className={parseClass('inputFieldRoot')}>
            <Input
              compact
              value={initialValues?.roomId || roomId}
              onChange={event => {
                setRoomId(event.target.value);
              }}
            ></Input>
          </div>
          <div className={parseClass('inputName')}>
            <span>Role</span>
          </div>
          <div className={parseClass('inputFieldRoot')}>
            <Select
              name="role"
              value={initialValues?.role || role}
              onChange={event => {
                setRole(event.target.value);
              }}
            >
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
              <option value="Viewer">Viewer</option>
            </Select>
          </div>
          <div className={parseClass('inputName')}>
            <span>Environment</span>
          </div>
          <div className={parseClass('inputFieldRoot')}>
            <Select
              name="endpoint"
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
            </Select>
          </div>
          <div className={parseClass('joinRoot')}>
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
