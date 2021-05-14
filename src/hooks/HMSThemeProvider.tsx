import React, { useContext, createContext } from 'react';

import HMSThemeProps, { appBuilder } from './interfaces/HMSThemeProvider';

import { merge } from 'lodash';

import { theme as defaultTailwindConfig } from '../defaultTheme';
import { create } from 'twind';

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
  const twConfig = merge(defaultTailwindConfig, config);
  const { tw } = create(twConfig || {});
  return (
    <HMSThemeContext.Provider
      value={{
        tw,
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
