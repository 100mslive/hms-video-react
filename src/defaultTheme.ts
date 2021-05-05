import { ThemeConfiguration } from "twind";

export const theme = () => {
  //TODO check why fontSize types are not matching
  //@ts-ignore
  const defaultTheme = {
    extend:{
    colors: { 
      blue: {
        tint: '#74AAFF',
        main: '#2F80FF',
        shade: '#0B326F',
      },
      red: {
        tint: '#E66977',
        main: '#D74451',
        shade: '#6F2229',
      },
      gray: {
        100: '#212121',
        200: '#3B3B3B',
        300: '#5E5E5E',
        400: '#8E8E8E',
        500: '#C7C7C7',
      },
      transparent: {
        lightest:'rgba(0, 0, 0, 0.37) 0%',
        light: 'rgba(255, 255, 255, 0.25)',
        dark: 'rgba(0, 0, 0, 0.75)',
        darker:'rgba(0, 0, 0, 0) 93.75%',
        disabled: 'rgba(59, 59, 59, 0.3)',
      },
    },
    fontSize: {
      sm: ['0.75rem', { lineHeight: '1rem' }],
      base: ['0.875rem', { lineHeight: '1.25rem' }],
      lg: ['1rem', { lineHeight: '1.5rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '1.75rem' }],
    },
    maxHeight: {
      100: '37.5rem',
      116: '29rem',
      125:'31.25rem'
    },
    width: {
      7.5: '1.875rem',
      8.75: '8.75rem',
      22.5: '22.5rem',
      37.5: '37.5rem',
      42.5: '42.5rem',
    },
    height: {
      3.25: '3.25rem',
      22.5: '22.5rem',
      37.5: '37.5rem',
      400: '40rem',
      42.5: '42.5rem',
    },
    scale: {
      '-100': '-1',
    },
    margin: {
      1.625: '1.625rem',
      1.875: '1.875rem',
      5.5: '5.5rem',
    },
    padding: {
      0.875: '0.875rem',
    },
  }
  } as ThemeConfiguration;
  console.log("Returning theme", defaultTheme);
  return defaultTheme;
} 