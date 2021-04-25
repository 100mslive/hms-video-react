import React from 'react';
import { TW } from 'twind';
import {addGlobalCss} from '../';
import clsx from 'clsx';

export interface WithClassesProps<P> {
    classes:P;
  }
  
export type BaseClassesProps = Map<string, string> | {};
  
  
const withClasses = <Component, ComponentProps extends {}>(Component:React.ComponentType<Component>, componentName:string, defaultSeedStyleMap:Map<string, string>, tw:TW) => 
//TODO replace with correct typescript HOC standard https://react-typescript-cheatsheet.netlify.app/docs/hoc/intro/ 
class WithClasses extends React.Component<ComponentProps & WithClassesProps<BaseClassesProps>, WithClassesProps<BaseClassesProps>>{
    state = {
    classes:{} as BaseClassesProps
    }
    componentDidMount(){
    const {classes:extraClasses} = this.props;
    let seedStyleMap = addGlobalCss({seedStyleMap:defaultSeedStyleMap, componentName, tw});
    for (const seed in extraClasses){
        //@ts-ignore
        seedStyleMap[seed] = clsx (seedStyleMap[seed], extraClasses[seed]);
    }
    this.setState({classes:seedStyleMap});        
    }
    render(){
    const {classes, ...rest} = this.props;
    //@ts-expect-error
    return <Component {...rest} classes={this.state.classes}/> as React.Component<ComponentProps & WithClassesProps<BaseClassesProps>, any>
    }
}
  
export {withClasses}