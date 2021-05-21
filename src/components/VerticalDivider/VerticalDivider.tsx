import React from 'react';
import { useHMSTheme } from '../../hooks/HMSThemeProvider';

export const VerticalDivider = () => {
  const { tw } = useHMSTheme();
  return <div className={`${tw('w-px bg-gray-200 h-6')}`}></div>;
};
