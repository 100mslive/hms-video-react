const defaultTheme = require('tailwindcss/defaultTheme');
const {
  colors,
  borderRadius,
  lineHeight,
} = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          100: '#6DA5FF',
          250: '#438BFF',
          300: '#2F80FF',
          350: '#2A72E5',
          400: '#2565CC',
          500: '#1C4C99',
          600: '#173F7F',
          700: '#123266',
          800: '#0E264C',
          900: '#091933',
        },
        gray: {
          ...colors.gray,
          150: '#FFFFFF66',
          650: '#5c5c6e',
        },
        dark: {
          200: '#2B3139',
          300: '#1B2028',
          400: '#161B22',
          500: '#0F141D',
          600: '#0B0F15',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
