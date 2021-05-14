import React, { useContext, createContext } from 'react';

import HMSThemeProps, { appBuilder } from './interfaces/HMSThemeProvider';

import { merge } from 'lodash';

import { theme as defaultTailwindConfig } from '../defaultTheme';

const HMSThemeContext = createContext<HMSThemeProps | null>(null);

const config = {
  // theme: {
  //   extend: {
  //     colors: {
  //       brand: {
  //         tint: '#74AAFF',
  //         main: '#2F80FF',
  //         shade: '#0B326F',
  //       },
  //       danger: {
  //         tint: '#E66977',
  //         main: '#D74451',
  //         shade: '#6F2229',
  //       },
  //     },
  //   },
  // },
};

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
  const twConfig = merge(defaultTailwindConfig, config);
  return (
    <HMSThemeContext.Provider
      value={{
        tailwindConfig: twConfig,
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
