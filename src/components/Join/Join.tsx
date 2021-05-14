import React, { useEffect, useState, useMemo } from 'react';
import { resolveClasses } from '../../utils/classes/resolveClasses';
//@ts-ignore
import { apply, create } from 'twind';
import { Button } from '../TwButton';

const colors = {
  blue: {
    tint: '#74AAFF',
    main: '#2F80FF',
    shade: '#0B326F',
  },
  red: {
    tint: '#E66977',
    main: '#D74451',
    shade: '#6F2229',
  },
  gray: {
    100: '#212121',
    200: '#3B3B3B',
    300: '#5E5E5E',
    400: '#8E8E8E',
    500: '#C7C7C7',
    600: '#E3E3E3',
    700: '#F2F2F2',
  },
  transparent: {
    100: 'rgba(0, 0, 0, 0.37)',
    200: 'rgba(196,196,196, 0.21) ',
    300: 'rgba(255, 255, 255, 0.25)',
    400: 'rgba(0, 0, 0, 0.75)',
    500: 'rgba(0, 0, 0, 0.9375)',
    600: 'rgba(59, 59, 59, 0.3)',
    700: 'rgba(0,0,0,0.22)',
    800: 'rgba(59,59,59,0.13)',
  },
};
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
    'flex dark:bg-black dark:text-white bg-gray-700 justify-center items-center w-screen h-screen text-gray-100 ',
  containerRoot:
    'bg-gray-600 dark:bg-gray-100 bg-gray-500 w-1/2 m-2 p-3 rounded-lg divide-solid',
  header: 'text-2xl mb-3 p-3 border-b-2',
  inputRoot: 'flex flex-wrap text-lg',
  inputName: 'w-1/3 flex justify-end items-center',
  inputFieldRoot: 'p-2 w-2/3',
  inputField: 'rounded-lg bg-gray-700 dark:bg-gray-200 w-full p-1',
  joinRoot: 'w-full flex justify-end m-2',
  joinButton: 'bg-brand-main  rounded-lg px-5 py-2 focus:outline-none',
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
   * extra classes added  by user
   */
  classes?: { [key: string]: string } | JoinClasses;
}

type NativeAttrs = Omit<
  React.DetailsHTMLAttributes<any>,
  keyof StyledJoinProps
>;

export type JoinProps = StyledJoinProps & NativeAttrs;

export const Join = ({
  initialValues,
  submitOnClick,
  classes,
  ...props
}: StyledJoinProps) => {
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
  
  const tw = useMemo(()=>{return create({
    theme: {
      extend:{
        colors: colors,
      }
    },
    darkMode:'class',
  }).tw},[]);   

  useEffect(() => {
    initialValues?.username && setUserName(initialValues.username);
    initialValues?.role && setRole(initialValues.role);
    initialValues?.roomId && setRoomId(initialValues.roomId);
    initialValues?.endpoint && setEndpoint(initialValues.endpoint);
  }, [initialValues]);

  const parseClass = (s: keyof JoinClasses) => {
    return tw(`hmsui-${s}`, apply(finalClasses[s]));
  };

  return (
    <div className={parseClass('root')} {...props}>
      <div className={parseClass('containerRoot')}>
        <div className={parseClass('header')}>Join your class</div>
        <div className={parseClass('inputRoot')}>
          <div className={parseClass('inputName')}>
            <span>Username:</span>
          </div>
          <div className={parseClass('inputFieldRoot')}>
            <input
              className={parseClass('inputField')}
              value={initialValues?.username || username}
              onChange={event => {
                setUserName(event.target.value);
              }}
            ></input>
          </div>
          <div className={parseClass('inputName')}>
            <span>RoomId:</span>
          </div>
          <div className={parseClass('inputFieldRoot')}>
            <input
              className={parseClass('inputField')}
              value={initialValues?.roomId || roomId}
              onChange={event => {
                setRoomId(event.target.value);
              }}
            ></input>
          </div>
          <div className={parseClass('inputName')}>
            <span>Role:</span>
          </div>
          <div className={parseClass('inputFieldRoot')}>
            <select
              name="role"
              className={parseClass('inputField')}
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
          <div className={parseClass('inputName')}>
            <span>Environment:</span>
          </div>
          <div className={parseClass('inputFieldRoot')}>
            <select
              name="endpoint"
              className={parseClass('inputField')}
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
