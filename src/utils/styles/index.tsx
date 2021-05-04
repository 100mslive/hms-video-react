import React from 'react';
import { TW } from 'twind';
import { addGlobalCss } from '../';
export interface WithClassesProps<P> {
  classes: P;
}

function withClasses<C>(
  defaultClassesWithoutNames: C,
  componentName: string,
  tw: TW,
) {
  return function<T extends { defaultClasses?: C }>(
    Component: React.ComponentType<T>,
  ) {
    return function(props: Omit<T, 'owner'>): JSX.Element {
      const defaultClasses = addGlobalCss({
        seedStyleMap: defaultClassesWithoutNames,
        componentName,
        tw,
      });
      const newProps = { ...props, defaultClasses } as T;
      return <Component {...newProps} />;
    };
  };
}

export { withClasses };
