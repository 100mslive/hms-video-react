import React, {
  useState,
  useEffect,
  useMemo,
  MouseEventHandler,
  useRef,
} from 'react';
import {
  LeftCaratIcon,
  RightCaratIcon,
  DownCaratIcon,
  UpCaratIcon,
  DotIcon,
} from '../Icons';
import { hmsUiClassParserGenerator } from '../../utils/classes';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';
import './index.css';

export interface CarouselProps {
  children?: React.ReactNode | React.ReactNode[] | string;
  direction?: 'horizontal' | 'vertical';
  showNavigation?: boolean;
  classes?: CarouselClasses;
  width: number;
}

interface CarouselClasses {
  root?: string;
  rootHorizontal?: string;
  rootVertical?: string;
  pageContainer?: string;
  carouselContainer?: string;
  carouselInner?: string;
  videoTileContainer?: string;
  navContainer?: string;
  navContainerHorizontal?: string;
  navContainerVertical?: string;
  caratActive?: string;
  caratInactive?: string;
  dotButton?: string;
  dotActive?: string;
  dotInactive?: string;
  carat?: string;
  dot?: string;
}

const defaultClasses: CarouselClasses = {
  root: `w-full h-full`,
  rootHorizontal: 'overflow-x-auto md:pb-6',
  rootVertical: 'overflow-y-auto flex-col pr-6',
  pageContainer: 'inline-block align-top w-full h-full',
  carouselContainer: 'overflow-hidden w-full h-full',
  carouselInner: 'w-full h-full whitespace-nowrap',
  videoTileContainer: 'flex justify-center',
  navContainer: 'absolute w-full flex justify-center items-center',
  navContainerHorizontal: 'bottom-0 left-0 z-30',
  navContainerVertical: 'top-0 right-0 flex-col z-30',
  caratActive: 'text-gray-100 dark:text-white cursor-pointer',
  caratInactive: 'text-transparent-700 dark:text-transparent-300',
  dotActive: 'text-gray-100 dark:text-white',
  dotInactive: 'text-transparent-700 dark:text-transparent-300 cursor-pointer',
  carat: 'w-4 h-4 m-1',
  dot: 'w-2 h-2 m-1',
  dotButton:
    'inline-block focus:outline-none focus-visible:ring-4 focus-visible:blue-tint',
};

const customClasses: CarouselClasses = {
  root: 'no-scrollbar',
};

export const Carousel = React.forwardRef(
  (
    {
      direction = 'horizontal',
      showNavigation = true,
      classes,
      width,
      children,
    }: CarouselProps,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const pages = Array.isArray(children) ? children : [children];
    const carouselRef = useRef(null);

    const { tw } = useHMSTheme();
    const styler = useMemo(
      () =>
        hmsUiClassParserGenerator<CarouselClasses>({
          tw,
          classes,
          customClasses,
          defaultClasses,
          tag: 'hmsui-carousel',
        }),
      [],
    );

    const showNav = showNavigation && pages.length > 1;

    const navClassName = `${styler('navContainer')} ${
      direction === 'horizontal'
        ? styler('navContainerHorizontal')
        : styler('navContainerVertical')
    }`;

    useEffect(() => {
      if (carouselRef) {
        const el: HTMLElement = carouselRef.current!;
        const scrollAmount = currentPageIndex * width;
        el.scrollTo({
          left: scrollAmount,
          behavior: 'smooth',
        });
      }
    }, [currentPageIndex, width]);

    return (
      <>
        <div
          className={`${styler('root')} ${
            direction === 'horizontal'
              ? styler('rootHorizontal')
              : styler('rootVertical')
          }`}
        >
          <div className={`${styler('carouselContainer')}`} ref={carouselRef}>
            <div className={`${styler('carouselInner')}`} ref={ref}>
              {pages.map((page, index) => (
                <div
                  className={`${styler('pageContainer')}`}
                  key={`slide=${index}`}
                >
                  {pages[index]}
                </div>
              ))}
            </div>
          </div>
        </div>
        {showNav ? (
          <div className={navClassName}>
            <PrevButton
              direction={direction}
              isActive={currentPageIndex !== 0}
              onClick={e => {
                if (currentPageIndex > 0) {
                  setCurrentPageIndex(currentPageIndex - 1);
                }
              }}
              styler={styler}
            />

            {pages.map((page, index) => (
              <button
                className={`${styler('dotButton')}`}
                onClick={e => {
                  setCurrentPageIndex(index);
                }}
              >
                <DotIcon
                  className={`${
                    index === currentPageIndex
                      ? styler('dotActive')
                      : styler('dotInactive')
                  } ${styler('dot')}`}
                />
              </button>
            ))}

            <NextButton
              direction={direction}
              isActive={currentPageIndex !== pages.length - 1}
              onClick={e => {
                if (currentPageIndex < pages.length - 1) {
                  setCurrentPageIndex(currentPageIndex + 1);
                }
              }}
              styler={styler}
            />
          </div>
        ) : null}
      </>
    );
  },
);

interface ButtonProps {
  direction: 'horizontal' | 'vertical';
  isActive: boolean;
  onClick: MouseEventHandler;
  styler: Function;
}

function NextButton({ direction, isActive, onClick, styler }: ButtonProps) {
  const className = `${
    isActive ? styler('caratActive') : styler('caratInactive')
  } ${styler('carat')}`;

  return (
    <button
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
      onClick={onClick}
    >
      {direction === 'horizontal' ? (
        <RightCaratIcon className={className} />
      ) : (
        <DownCaratIcon className={className} />
      )}
    </button>
  );
}

function PrevButton({ direction, isActive, onClick, styler }: ButtonProps) {
  const className = `${
    isActive ? styler('caratActive') : styler('caratInactive')
  } ${styler('carat')}`;

  return (
    <button
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
      onClick={onClick}
    >
      {direction === 'horizontal' ? (
        <LeftCaratIcon className={className} />
      ) : (
        <UpCaratIcon className={className} />
      )}
    </button>
  );
}
