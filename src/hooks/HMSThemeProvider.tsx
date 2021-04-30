import React, { useState, useContext, createContext } from 'react';

import HMSThemeProps from './interfaces/HMSThemeProvider';

const defaulTheme = require('../../defaultTheme.ts').theme;

import { merge } from 'lodash';

const HMSThemeContext = createContext<HMSThemeProps | null>(null);

export const HMSThemeProvider = ({
  theme,
  children,
}: {
  children: React.ReactNode;
  theme: any;
}) => {
  return (
    <HMSThemeContext.Provider
      value={{
        theme: merge(defaulTheme, theme),
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
