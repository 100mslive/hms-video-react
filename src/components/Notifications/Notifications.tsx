import React, { useMemo } from 'react';
import './notification.css';
import { CloseIcon, ShareScreenIcon } from '../Icons';
import { useHMSTheme } from '../..';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Button } from '../TwButton';
import { Text } from '../Text';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotificationClasses {
  root?: string;
  rootIcon?: string;
  rootCenter?: string;
  rootClose?: string;
}

interface Props {
  /**
   * extra classes added  by user
   */
  classes?: { [key: string]: string } | NotificationClasses;
}

const defaultClasses: NotificationClasses = {
  root: `rounded-lg dark:bg-gray-100 bg-white p-5 flex items-center justify-between`,
  rootIcon: ``,
  rootCenter: `flex items-center dark:text-white text-black  space-x-4`,
  rootClose: `cursor-pointer`,
};

// @ts-ignore
const NotificationUI = ({ styler }) => {
  return (
    <div style={{ width: '612px' }} className={styler('root')}>
      <div className={styler('rootIcon')}>
        <ShareScreenIcon />
      </div>
      <div className={styler('rootCenter')}>
        <p>
          <Text variant="body">
            Sanjana Ma’am is requesting you to share your screen
          </Text>
        </p>
        <Button>Share Screen</Button>
      </div>
      <div className={styler('rootClose')}>
        <CloseIcon className="text-gray-400" />
      </div>
    </div>
  );
};

export const Notifications: React.FC<Props> = ({ classes }) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<NotificationClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'hmsui-notification',
      }),
    [],
  );

  const showNotification = () => toast(<NotificationUI styler={styler} />);
  return (
    <>
      <button onClick={showNotification}>Trigger Notif</button>
      <ToastContainer style={{ width: '612px' }} />
    </>
  );
};
