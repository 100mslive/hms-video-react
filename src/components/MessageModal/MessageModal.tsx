import React, { useMemo } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Button } from '../Button';
import { CloseIcon } from '../Icons';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import { withClasses } from '../../utils/styles';
import { hmsUiClassParserGenerator } from '../../utils/classes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export interface MessageModalClasses {
  root?: string;
  containerRoot?: string;
  spanRoot?: string;
  boxTransition?: string;
  boxRoot?: string;
  header?: string;
  title?: string;
  closeRoot?: string;
  closeButton?: string;
  body?: string;
  footer?: string;
  modalType?: string;
  feedbackTitle?: string;
  hide?: string;
}

export interface StyledMessageModalProps {
  show: boolean;
  title: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  defaultClasses?: MessageModalClasses;
  classes?: MessageModalClasses;
  modalType?: string;
}

const defaultClasses: MessageModalClasses = {
  root: 'z-50 relative overflow-y-auto',
  containerRoot:
    'flex items-center justify-center absolute pt-4 px-4 pb-20 text-center sm:block sm:p-0',
  spanRoot: 'hidden sm:inline-block sm:align-middle sm:h-screen',
  boxTransition:
    'focus:outline-none insert-y-20 inline-block align-bottom text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-lg sm:w-full',
  boxRoot:
    'flex flex-col md:flex-row md:flex-wrap bg-white dark:bg-gray-100 rounded-lg sm:items-start md:w-100 focus:outline-none rounded-tr-lg text-center font-normal sm:text-left md:text-base text-sm text-gray-100 dark:text-gray-500 px-5 py-5',
  header: 'flex flex-grow flex-row items-center mb-4',
  title:
    'flex flex-1 lg:text-2xl sm:text-xl self-center items-center text-gray-100 dark:text-white font-medium',
  closeRoot: 'self-start',
  closeButton:
    'w-full justify-end text-base font-medium rounded-xl focus:outline-none',
  body: 'w-full',
  footer: 'mt-4 w-full flex justify-end',
  feedbackTitle:
    'flex flex-1 lg:text-xl sm:text-xl self-center justify-center text-gray-100 dark:text-white font-small',
  hide: 'hidden',
};

export const StyledMessageModal = ({
  title = '',
  show = true,
  modalType,
  body,
  footer,
  onClose,
  classes,
}: StyledMessageModalProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<MessageModalClasses>({
        tw,
        classes,
        defaultClasses,
        tag: 'message-modal',
      }),
    [],
  );
  const styles = useStyles();

  return (
    <div
      className={styler('root')}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {show && (
        <Backdrop className={styles.backdrop} open={true}>
          <div className={styler('containerRoot')}>
            <span className={styler('spanRoot')} aria-hidden="true">
              &#8203;
            </span>

            <div className={styler('boxTransition')}>
              <div className={styler('boxRoot')}>
                <div className={styler('header')}>
                  <div
                    className={`${
                      modalType === 'feedback'
                        ? styler('feedbackTitle')
                        : styler('title')
                    }`}
                  >
                    {title}
                  </div>
                  <div
                    className={`${
                      modalType === 'feedback'
                        ? styler('hide')
                        : styler('closeRoot')
                    }`}
                  >
                    <Button
                      variant="no-fill"
                      onClick={onClose}
                      iconOnly
                      size="sm"
                    >
                      <CloseIcon />
                    </Button>
                  </div>
                </div>
                <div className={styler('body')}>{body}</div>
                <div className={styler('footer')}>{footer}</div>
              </div>
            </div>
          </div>
        </Backdrop>
      )}
    </div>
  );
};

export type MessageModalProps = Omit<StyledMessageModalProps, 'defaultClasses'>;

export const MessageModal = withClasses<MessageModalClasses | undefined>(
  defaultClasses,
  'MessageModal',
)<StyledMessageModalProps>(StyledMessageModal);
