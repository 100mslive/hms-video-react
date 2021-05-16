import React, {useState, useEffect, useRef, useCallback, createRef } from 'react';
import { useInView } from 'react-intersection-observer';
import {
    LeftCaratIcon,
    RightCaratIcon,
    DownCaratIcon,
    UpCaratIcon,
    DotIcon,
  } from '../Icons';
import {scrollTo, mergeRefs} from '../../utils';
import {hmsUiClassParserGenerator} from '../../utils/classes';
import './index.css'

export interface CarouselProps {
    children?:React.ReactNode | React.ReactNode[] | string;
    direction?: 'horizontal' | 'vertical';
    showNavigation?: boolean;
    classes?:CarouselClasses;    
}  

interface CarouselClasses {
    root?:string;
    rootHorizontal?: string;
    rootVertical?: string;
    pageContainer?:string;
    videoTileContainer?: string;
    navContainer?:string;
    navContainerHorizontal?:string;
    navContainerVertical?:string;
    caratActive?:string;
    caratInactive?:string;
    dotActive?:string;
    dotInactive?:string;
    carat?:string;
    dot?:string;
}

const defaultClasses: CarouselClasses = {
    root:
      `w-full h-full flex`,
    rootHorizontal: 'overflow-x-auto pb-6',
    rootVertical: 'overflow-y-auto flex-col pr-6',
    pageContainer:'flex-shrink-0 w-full h-full',
    videoTileContainer: 'flex justify-center',
    navContainer:'absolute w-full flex justify-center items-center',
    navContainerHorizontal:'bottom-0 left-0',
    navContainerVertical:'top-0 right-0 flex-col',
    caratActive:'text-gray-100 dark:text-white cursor-pointer',
    caratInactive:'text-transparent-700 dark:text-transparent-300',
    dotActive:'text-gray-100 dark:text-white',
    dotInactive:'text-transparent-700 dark:text-transparent-300 cursor-pointer',
    carat:'w-4 h-4 m-1',
    dot:'w-2 h-2 m-1'
  };

const customClasses:CarouselClasses = {
  root:'no-scrollbar',
}

export const Carousel = ({direction='horizontal', showNavigation=true, classes, children}:CarouselProps) => {
    if(!!!children) return <></>;

    const hu = useCallback(hmsUiClassParserGenerator<CarouselClasses>({classes, customClasses, defaultClasses, tag:'hmsui-carousel'}),[]);
        
    const pages=Array.isArray(children)?children:[children];
    const showNav=showNavigation && Array.isArray(children) && pages.length>1;
    const [currentPage, setCurrentPage] = useState(0);
    const { ref: prevRef, inView:prevInView } = useInView({ threshold: 0.5 });
    const { ref: nextRef, inView:nextInView } = useInView({ threshold: 0.5 });

    const [refs, setRefs]= React.useState<React.MutableRefObject<HTMLDivElement | null>[]>([]);
    
    useEffect(()=>{
      setRefs(refs => (
        Array(pages.length).fill({}).map((page, index)=> refs[index] || createRef<HTMLDivElement>())
      ))
    },[children])

    useEffect(()=>{
      if(prevInView){
        setCurrentPage(currentPage=>currentPage-1);      
      }
    },[prevInView])
  
    useEffect(()=>{
      if(nextInView){
        setCurrentPage(currentPage=>currentPage+1);
      }
    },[nextInView])
  
    return (<>
      <div className={`${hu('root')} ${direction==='horizontal'?hu('rootHorizontal'):hu('rootVertical')}`} style={{scrollBehavior:'smooth', WebkitOverflowScrolling:'touch', scrollSnapType:`${direction==='horizontal'?'x':'y'} mandatory`, msOverflowStyle:'none', scrollbarWidth:'none'}}>
        {pages.map((page, index) => 
        {
          switch (index){
            case currentPage-1:
              return <div key={index} ref={mergeRefs(prevRef, refs[index])} className={hu('pageContainer')} style={{scrollSnapAlign:'start'}}></div>          
            case currentPage+1:
              return <div key={index} ref={mergeRefs(nextRef, refs[index])} className={hu('pageContainer')} style={{scrollSnapAlign:'start'}}></div>          
          case currentPage:
            return (<div key={index} ref={refs[index]} className={hu('pageContainer')} style={{scrollSnapAlign:'start', }}>
            {page}
          </div>)
              default:
              return <div key={index} ref={refs[index]} className={hu('pageContainer')} style={{scrollSnapAlign:'start'}}></div> 
          }
        }
          )
        }
      {showNav && (<div className={`${hu('navContainer')} ${direction==='horizontal'?hu('navContainerHorizontal'):hu('navContainerVertical')}`}>
          <a onClick={currentPage!==0?scrollTo(refs[currentPage-1]):()=>{}}>
            {direction==='horizontal'?
            <LeftCaratIcon className={`${currentPage!==0?hu('caratActive'):hu('caratInactive')} ${hu('carat')}`}/> :
            <UpCaratIcon className={`${currentPage!==0?hu('caratActive'):hu('caratInactive')} ${hu('carat')}`}/>
            }
          </a>
          {pages.map((page, index)=>
          (<a className="inline-block" onClick={scrollTo(refs[index])}>
            <DotIcon className={`${index===currentPage?hu('dotActive'):hu('dotInactive')} ${hu('dot')}`} />
          </a>))
          }
        <a onClick={currentPage!==(pages.length-1)?scrollTo(refs[currentPage+1]):()=>{}}>
        {direction==='horizontal'?
          <RightCaratIcon className={`${currentPage!==(pages.length-1)?hu('caratActive'):hu('caratInactive')} ${hu('carat')}`} />:
          <DownCaratIcon className={`${currentPage!==(pages.length-1)?hu('caratActive'):hu('caratInactive')} ${hu('carat')}`} />
        }
        </a>
      </div>)}
      </div>
    </>)
  }