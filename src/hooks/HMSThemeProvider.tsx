import React, { useContext, createContext } from 'react';

import HMSThemeProps, { appBuilder } from './interfaces/HMSThemeProvider';

import { merge } from 'lodash';

import { theme as defaultTailwindConfig } from '../defaultTheme';

const HMSThemeContext = createContext<HMSThemeProps | null>(null);

export const HMSThemeProvider = ({
  config,
  children,
  appBuilder,
}: {
  children: React.ReactNode;
  config: any;
  appBuilder: appBuilder;
}) => {
  if (appBuilder.theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  return (
    <HMSThemeContext.Provider
      value={{
        tailwindConfig: merge(defaultTailwindConfig, config),
        appBuilder,
      }}
    >
      {children}
    </HMSThemeContext.Provider>
  );
};

export const useHMSTheme = () => {
  const HMSContextConsumer = useContext(HMSThemeContext);

  if (HMSContextConsumer === null) {
    throw new Error('HMSContext state variables are not set');
  }

  return HMSContextConsumer;
};
