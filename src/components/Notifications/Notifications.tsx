import React, { useMemo } from 'react';
import './notification.css';
import { CloseIcon, ShareScreenIcon } from '../Icons';
import { useHMSTheme } from '../..';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { Button } from '../TwButton';
import { Text } from '../Text';
import { toast, ToastContainer, ToastProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NotificationClasses {
  root?: string;
  rootLeft?: string;
  rootCenter?: string;
  rootRight?: string;
}

interface Props {
  /**
   * Left Component
   */
  leftComponent?: JSX.Element;
  /**
   * Left Component
   */
  centerComponent?: JSX.Element;
  /**
   * Left Component
   */
  rightComponent?: JSX.Element;
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

// @ts-ignore
const NotificationUI = ({ styler, left, center, right }) => {
  return (
    <div style={{ width: '612px' }} className={styler('root')}>
      <div className={styler('rootLeft')}>{left}</div>
      <div className={styler('rootCenter')}>{center}</div>
      <div className={styler('rootRight')}>{right}</div>
    </div>
  );
};

export const Notifications: React.FC<Props> = ({
  classes,
  toastProps,
  leftComponent,
  centerComponent,
  rightComponent,
}) => {
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

  const showNotification = () =>
    toast(
      <NotificationUI
        styler={styler}
        left={leftComponent}
        center={centerComponent}
        right={rightComponent}
      />,
    );
  return (
    <>
      <button onClick={showNotification}>Trigger Notification</button>
      <ToastContainer style={{ width: '612px' }} {...toastProps} />
    </>
  );
};
