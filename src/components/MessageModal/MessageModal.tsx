import React from 'react';
import { CloseIcon } from '../../icons';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { withClasses } from '../../utils/styles';
import { combineClasses } from '../../utils';

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
  message?: string;
}

export interface StyledMessageModalProps {
  title: string;
  message: string;
  secondary?: string;
  show: boolean;
  allow: boolean;
  gobackOnClick: () => void;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  defaultClasses?: MessageModalClasses;
  classes?: MessageModalClasses;
}

const defaultClasses: MessageModalClasses = {
  root: 'z-50 relative overflow-y-auto',
  containerRoot:
    'flex items-center justify-center absolute pt-4 px-4 pb-20 text-center sm:block sm:p-0',
  spanRoot: 'hidden sm:inline-block sm:align-middle sm:h-screen',
  boxTransition:
    'focus:outline-none insert-y-20 inline-block align-bottom text-left overflow-hidden transform transition-all sm:align-middle sm:max-w-lg sm:w-full',
  boxRoot:
    'flex flex-col md:flex-row md:flex-wrap bg-white dark:bg-gray-100 rounded-lg sm:items-start md:w-100 focus:outline-none rounded-tr-lg text-center font-normal pb-4 sm:text-left',
  header: 'flex flex-grow flex-row px-5 pt-5 items-center',
  title:
    'flex flex-grow lg:text-2xl sm:text-xl self-center items-center text-gray-100 dark:text-white font-medium',
  closeRoot:
    'flex flex-none self-center justify-end items-end right-0 bg-white dark:bg-gray-100 hover:bg-gray-600 dark:hover:bg-gray-200 sm:flex sm:flex-row-reverse',
  closeButton:
    'w-full justify-end text-base font-medium rounded-xl focus:outline-none',
  message:
    'flex flex-col space-y-2.5 px-5 py-3 md:text-base text-sm text-gray-100 dark:text-gray-500',
};

export const StyledMessageModal = ({
  title = 'Permission Denied!',
  message = 'Click on camera icon',
  secondary = 'I dont know',
  show = true,
  allow,
  gobackOnClick,
  setShow,
  classes: extraClasses,
}: StyledMessageModalProps) => {
  //@ts-expect-error
  const combinedClasses = combineClasses(defaultClasses, extraClasses);
  const classes = useStyles();

  return (
    <div
      className={combinedClasses?.root}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {show && (
        <Backdrop className={classes.backdrop} open={true}>
          <div className={combinedClasses?.containerRoot}>
            <span className={combinedClasses?.spanRoot} aria-hidden="true">
              &#8203;
            </span>

            <div className={combinedClasses?.boxTransition}>
              <div className={combinedClasses?.boxRoot}>
                <div className={combinedClasses?.header}>
                  <div className={combinedClasses?.title}>{title}</div>
                  <div className={combinedClasses?.closeRoot}>
                    <button
                      type="button"
                      className={combinedClasses?.closeButton}
                      onClick={() => {
                        setShow(false);
                        !allow && gobackOnClick();
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
                <div className={combinedClasses?.message}>
                  <p>{message}</p>
                  <p>{secondary}</p>
                </div>
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
