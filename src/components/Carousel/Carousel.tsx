import React, {
  useState,
  useEffect,
  useCallback,
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
  videoTileContainer?: string;
  navContainer?: string;
  navContainerHorizontal?: string;
  navContainerVertical?: string;
  caratActive?: string;
  caratInactive?: string;
  dotActive?: string;
  dotInactive?: string;
  carat?: string;
  dot?: string;
}

const defaultClasses: CarouselClasses = {
  root: `w-full h-full`,
  rootHorizontal: 'overflow-x-auto pb-6',
  rootVertical: 'overflow-y-auto flex-col pr-6',
  pageContainer: 'flex-shrink-0 w-full h-full',
  videoTileContainer: 'flex justify-center',
  navContainer: 'absolute w-full flex justify-center items-center',
  navContainerHorizontal: 'bottom-0 left-0',
  navContainerVertical: 'top-0 right-0 flex-col',
  caratActive: 'text-gray-100 dark:text-white cursor-pointer',
  caratInactive: 'text-transparent-700 dark:text-transparent-300',
  dotActive: 'text-gray-100 dark:text-white',
  dotInactive: 'text-transparent-700 dark:text-transparent-300 cursor-pointer',
  carat: 'w-4 h-4 m-1',
  dot: 'w-2 h-2 m-1',
};

const customClasses: CarouselClasses = {
  root: 'no-scrollbar',
};

export const Carousel = ({
  direction = 'horizontal',
  showNavigation = true,
  classes,
  children,
}: CarouselProps) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const pages = Array.isArray(children) ? children : [children];
  const carouselRef = useRef(null);

  const hu = useCallback(
    hmsUiClassParserGenerator<CarouselClasses>({
      classes,
      customClasses,
      defaultClasses,
      tag: 'hmsui-carousel',
    }),
    [],
  );

  const showNav = showNavigation && pages.length > 1;

  const navClassName = `${hu('navContainer')} ${
    direction === 'horizontal'
      ? hu('navContainerHorizontal')
      : hu('navContainerVertical')
  }`;

  useEffect(() => {
    if (carouselRef) {
      const el: HTMLElement = carouselRef.current!;
      const width = el.clientWidth;
      const scrollAmount = currentPageIndex * width;
      el.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }, [currentPageIndex]);

  return (
    <>
      <div
        className={`${hu('root')} ${
          direction === 'horizontal' ? hu('rootHorizontal') : hu('rootVertical')
        }`}
      >
        <div className="overflow-hidden w-full h-full" ref={carouselRef}>
          <div className="w-full h-full whitespace-nowrap">
            {pages.map((page, index) => (
              <div
                className="inline-block align-top w-full h-full"
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
            hu={hu}
          />

          {pages.map((page, index) => (
            <button
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              onClick={e => {
                setCurrentPageIndex(index);
              }}
            >
              <DotIcon
                className={`${
                  index === currentPageIndex
                    ? hu('dotActive')
                    : hu('dotInactive')
                } ${hu('dot')}`}
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
            hu={hu}
          />
        </div>
      ) : null}
    </>
  );
};

interface ButtonProps {
  direction: 'horizontal' | 'vertical';
  isActive: boolean;
  onClick: MouseEventHandler;
  hu: Function;
}

function NextButton({ direction, isActive, onClick, hu }: ButtonProps) {
  const className = `${isActive ? hu('caratActive') : hu('caratInactive')} ${hu(
    'carat',
  )}`;

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

function PrevButton({ direction, isActive, onClick, hu }: ButtonProps) {
  const className = `${isActive ? hu('caratActive') : hu('caratInactive')} ${hu(
    'carat',
  )}`;

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
