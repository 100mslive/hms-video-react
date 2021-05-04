import React, { useState, useContext, createContext } from 'react';

import HMSThemeProps from './interfaces/HMSThemeProvider';

const defaultTailwindConfig = require('../../defaultTheme.ts');

import { merge } from 'lodash';

const HMSThemeContext = createContext<HMSThemeProps | null>(null);

export const HMSThemeProvider = ({
  config,
  children,
}: {
  children: React.ReactNode;
  config: any;
}) => {
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
