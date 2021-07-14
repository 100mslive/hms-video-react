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

const images = [
  '/images/1.jpeg',
  '/images/2.jpeg',
  '/images/3.jpeg',
  '/images/4.jpeg',
  '/images/5.jpeg',
  '/images/6.jpeg',
  '/images/7.jpeg',
  '/images/8.jpeg',
  '/images/9.jpeg',
  '/images/10.jpeg',
  '/images/11.jpeg',
  '/images/12.jpeg',
  '/images/13.jpeg',
  '/images/14.jpeg',
  '/images/15.jpeg',
  '/images/16.jpeg',
  '/images/17.jpeg',
];

export interface VirtualBackgroundModalClasses {
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
  imageContainer?: string;
  image?: string;
}

export interface StyledVirtualBackgroundModalProps {
  show: boolean;
  onClose: () => void;
  defaultClasses?: VirtualBackgroundModalClasses;
  classes?: VirtualBackgroundModalClasses;
}

const defaultClasses: VirtualBackgroundModalClasses = {
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
  imageContainer: 'flex flex-wrap',
  image: 'w-28 h-28 rounded-sm',
};

export const StyledVirtualBackgroundModal = ({
  show = true,
  onClose,
  classes,
}: StyledVirtualBackgroundModalProps) => {
  const { tw } = useHMSTheme();
  const styler = useMemo(
    () =>
      hmsUiClassParserGenerator<VirtualBackgroundModalClasses>({
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
                  <div className={styler('title')}>Choose Background</div>
                  <div className={styler('closeRoot')}>
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
                <div className={styler('body')}>
                  <div className={styler('imageContainer')}>
                    {images.map((image, index) => {
                      return (
                        <img
                          className={styler('image')}
                          src={image}
                          alt={`${index + 1} image`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Backdrop>
      )}
    </div>
  );
};

export type VirtualBackgroundProps = Omit<
  StyledVirtualBackgroundModalProps,
  'defaultClasses'
>;

export const VirtualBackgroundModal = withClasses<
  VirtualBackgroundModalClasses | undefined
>(
  defaultClasses,
  'VirtualBackgroundModal',
)<StyledVirtualBackgroundModalProps>(StyledVirtualBackgroundModal);
