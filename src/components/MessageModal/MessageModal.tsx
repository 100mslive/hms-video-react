import React from 'react';
import { CloseMessage } from '../../icons';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export interface MessageModalProps {
  title: string;
  message: string;
  secondary?: string;
  show: boolean;
  allow: boolean;
  gobackOnClick: () => void;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MessageModal = ({
  title,
  message,
  secondary,
  show,
  allow,
  gobackOnClick,
  setShow,
}: MessageModalProps) => {
  const classes = useStyles();
  // show = !show
  // const { isModalOpen, toggleModal} = useContext(AppContext);
  return (
    <div
      className="fixed z-50 relative overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {show && (
        <Backdrop className={classes.backdrop} open={true}>
          <div className="flex items-center justify-center top-1/3 absolute pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="focus:outline-none insert-y-10 inline-block align-bottom text-left overflow-hidden transform transition-all sm:align-middle sm:w-full">
              <div className="flex flex-col md:flex-row md:flex-wrap bg-gray-100 rounded-lg sm:items-start md:w-100 focus:outline-none rounded-tr-lg text-center font-normal pb-4 sm:text-left">
                <div className="flex flex-grow flex-row px-5 pt-5 items-center">
                  <div className="flex flex-grow lg:text-2xl sm:text-xl self-center items-center text-white font-medium">
                    {title}
                  </div>
                  <div className="flex flex-none self-center justify-end items-end right-0 bg-gray-100 hover:bg-gray-200 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full justify-end shadow-sm text-base font-medium rounded-xl focus:outline-none"
                      onClick={() => {
                        setShow(false);
                        !allow && gobackOnClick();
                      }}
                    >
                      {CloseMessage}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col space-y-2.5 px-5 py-3">
                  <p className="md:text-base text-sm text-gray-500">
                    {message}
                  </p>
                  <p className="md:text-base text-sm text-gray-500">
                    {secondary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Backdrop>
      )}
    </div>
  );
};
