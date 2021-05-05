import React, { useState, useContext, createContext } from 'react';

import HMSThemeProps from './interfaces/HMSThemeProvider';

import { merge } from 'lodash';

const defaultTailwindConfig = require('../../defaultTheme.ts');

const HMSThemeContext = createContext<HMSThemeProps | null>(null);

export const HMSThemeProvider = ({
  config,
  children,
  appBuilder,
}: {
  children: React.ReactNode;
  config: any;
  appBuilder: { theme: 'light' | 'dark' };
}) => {
  if (appBuilder.theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  return (
    <HMSThemeContext.Provider
      value={{
        tailwindConfig: merge(defaultTailwindConfig, config),
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
