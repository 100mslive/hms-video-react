import React, {
  useState,
  useMemo,
  MouseEventHandler,
  useEffect,
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
  pageContainer: 'absolute w-full h-full',
  carouselContainer: 'overflow-hidden w-full h-full',
  carouselInner: 'w-full h-full whitespace-nowrap relative',
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

function getLeft(index: number, currentPageIndex: number) {
  //active slide
  if (index === currentPageIndex) {
    return 0;
  }
  //prev slide
  if (index + 1 === currentPageIndex) {
    return '-100%';
  }
  //next slide
  if (index - 1 === currentPageIndex) {
    return '100%';
  }
  //all slides before prev
  if (index < currentPageIndex) {
    return '-200%';
  }
  //all slides after next
  return '200%';
}

export const Carousel = React.forwardRef(
  (
    {
      direction = 'horizontal',
      showNavigation = true,
      classes,
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

    useEffect(() => {
      // currentPageIndex should not exceed pages length
      if (currentPageIndex >= pages.length) {
        setCurrentPageIndex(0);
      }
    }, [pages.length, currentPageIndex]);

    const navClassName = `${styler('navContainer')} ${
      direction === 'horizontal'
        ? styler('navContainerHorizontal')
        : styler('navContainerVertical')
    }`;

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
                  style={{
                    left: getLeft(index, currentPageIndex),
                    transition: 'left 0.3s ease-in-out',
                  }}
                >
                  {page}
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
              onClick={() => {
                if (currentPageIndex > 0) {
                  setCurrentPageIndex(currentPageIndex - 1);
                }
              }}
              styler={styler}
            />

            {pages.map((_, index) => (
              <button
                key={index}
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
              onClick={() => {
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
