import React, { useMemo } from 'react';
import { toast, ToastProps, ToastContainer } from 'react-toastify';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { CloseIcon } from '../Icons';
import { Text } from '../Text';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import './notification.css';
import 'react-toastify/dist/ReactToastify.css';

interface NotificationClasses {
  root?: string;
  rootLeft?: string;
  rootCenter?: string;
  rootRight?: string;
}

export interface NotificationProps {
  /**
   * Left Component
   */
  left?: JSX.Element;
  /**
   * Left Component
   */
  center?: JSX.Element;
  /**
   * Left Component
   */
  right?: JSX.Element;
  /**
   * extra classes added  by user
   */
  classes?: { [key: string]: string } | NotificationClasses;
  /**
   * Toast Props based on React-Toastify
   */
  toastProps?: Partial<ToastProps>;
}

const defaultClasses: NotificationClasses = {
  root: `rounded-lg dark:bg-gray-100 bg-white p-5 flex items-center justify-between`,
  rootLeft: ``,
  rootCenter: `flex items-center dark:text-white text-black  space-x-4`,
  rootRight: `cursor-pointer`,
};

export const Notifications = ({
  left,
  center,
  right,
  classes,
}: NotificationProps) => {
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
  return (
    <div className={styler('root')}>
      <div className={styler('rootLeft')}>{left}</div>
      <div className={styler('rootCenter')}>{center}</div>
      <div className={styler('rootRight')}>{right}</div>
    </div>
  );
};

export const hmsToast = (message: string, options?: NotificationProps) => {
  toast(
    <Notifications
      left={options?.left || <Text variant="body">{message}</Text>}
      center={options?.center}
      right={options?.right || <CloseIcon />}
    />,
    {
      ...options?.toastProps,
    },
  );
};

export const HMSToastContainer: React.FC<Partial<ToastProps>> = props => {
  return (
    <ToastContainer
      {...props}
      autoClose={3000}
      hideProgressBar
      closeButton={false}
      limit={5}
    />
  );
};
