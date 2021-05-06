import React, { useEffect, useState } from 'react';
import { addGlobalCss } from '../';
export interface WithClassesProps<P> {
  classes: P;
}

function withClasses<C>(defaultClassesWithoutNames: C, componentName: string) {
  return function<T extends { defaultClasses?: C }>(
    Component: React.ComponentType<T>,
  ) {
    return function(props: Omit<T, 'defaultClasses'>): JSX.Element {
      const [defaultClasses, setDefaultClasses] = useState<C | null | {}>(null);
      useEffect(() => {
        setDefaultClasses(
          addGlobalCss({
            seedStyleMap: defaultClassesWithoutNames,
            componentName,
          }),
        );
      }, []);
      const newProps = { ...props, defaultClasses } as T;
      return <Component {...newProps} />;
    };
  };
}

export { withClasses };
