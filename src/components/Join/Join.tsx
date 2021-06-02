import React, { useEffect, useState, useMemo } from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { Select } from '../Select';
import { Input } from '../Input';
import { Button } from '../Button';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { DoorIcon } from '../Icons';
import { Text } from '../Text';

interface Fields {
  username: string;
  roomId: string;
  role: string;
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

interface Option {
  label: string,
  value: string
}

const defaultClasses: JoinClasses = {
  root:
    'flex bg-white dark:bg-black justify-center items-center w-screen h-screen ',
  containerRoot:
    'bg-white dark:bg-gray-100 text-gray-100 dark:text-white w-1/2 m-2 p-3 rounded-xl divide-solid shadow-2 dark:shadow-none',
  header:
    'text-2xl mb-3 p-3 border-b-2 border-gray-600 dark:border-gray-200 flex items-center',
  inputRoot: 'flex flex-wrap text-lg',
  inputName:
    'w-1/3 flex justify-end items-center text-gray-100 dark:text-gray-500 pr-8',
  inputFieldRoot: 'p-2 w-2/3',
  inputField: 'rounded-lg bg-gray-700 dark:bg-gray-200 w-full p-1',
  joinRoot: 'w-full flex justify-end m-2',
  joinButton: 'bg-brand-main  rounded-lg px-5 py-2 focus:outline-none',
};

export interface JoinProps extends React.DetailsHTMLAttributes<any> {
  /**
   * Initial values to be filled in the form.
   */
  initialValues?: Partial<Fields>;
  /**
   * Roles to be passed by the user other defaults will be used
   * Each role should follow { label: string, value: string } format 
   */
  roles?: Option[],
  /**
   * Event handler for join button click.
   */
  submitOnClick: ({ username, roomId, role }: Fields) => void;
  /**
   * extra classes added  by user
   */
  classes?: { [key: string]: string } | JoinClasses;
}

const Join = ({
  initialValues,
  submitOnClick,
  classes,
  roles = [],
  ...props
}: JoinProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<JoinClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-join',
      }),
    [],
  );

  const [username, setUsername] = useState(initialValues?.username || '');
  const [role, setRole] = useState(initialValues?.role || roles[0].value);
  const [roomId, setRoomId] = useState(initialValues?.roomId || '');

  useEffect(() => {
    initialValues?.username && setUsername(initialValues.username);
    initialValues?.role && setRole(initialValues.role);
    initialValues?.roomId && setRoomId(initialValues.roomId);
  }, [initialValues]);

  return (
    <div className={styler('root')} {...props}>
      <div className={styler('containerRoot')}>
        <div className={styler('header')}>
          <DoorIcon className="mr-2" />
          <Text variant="heading">Join your class</Text>
        </div>
        <div className={styler('inputRoot')}>
          <div className={styler('inputName')}>
            <Text variant="heading" size="sm">
              Username
            </Text>
          </div>
          <div className={styler('inputFieldRoot')}>
            <Input
              compact
              defaultValue={initialValues?.username || username}
              onChange={event => {
                setUsername(event.target.value);
              }}
            ></Input>
          </div>
          <div className={styler('inputName')}>
            <Text variant="heading" size="sm">
              RoomId
            </Text>
          </div>
          <div className={styler('inputFieldRoot')}>
            <Input
              compact
              defaultValue={initialValues?.roomId || roomId}
              onChange={event => {
                setRoomId(event.target.value);
              }}
            ></Input>
          </div>
          <div className={styler('inputName')}>
            <Text variant="heading" size="sm">
              Role
            </Text>
          </div>
          <div className={styler('inputFieldRoot')}>
            <Select
              name="role"
              value={role}
              onChange={event => {
                setRole(event.target.value);
              }}
            >
              {roles.map(({ label, value}) => {
                return <option value={value}>{label}</option>
              })}
            </Select>
          </div>
          <div className={styler('joinRoot')}>
            <Button
              variant={'emphasized'}
              onClick={() =>
                submitOnClick({
                  username,
                  roomId,
                  role,
                })
              }
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

Join.defaultProps = {
  roles: [
    { label: "Student", value: "student" },
    { label: "Teacher", value: "teacher" },
    { label: "Viewer", value: "viewer" },
    { label: "Admin", value: "admin" },
  ]
}

export { Join };
