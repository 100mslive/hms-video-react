const postcss = require('rollup-plugin-postcss');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        config: {
          path: './postcss.config.js',
        },
        extensions: ['.css'],
        minimize: true,
        inject: {
          insertAt: 'top',
        },
      }),
    );
    return config;
  },
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        1: '0px 2px 9px rgba(0, 0, 0, 0.18)',
        2: '0px 11px 26px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        brand: {
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
          600: '#F2F2F2',
        },
        transparent: {
          0: 'rgba(0,0,0,0)',
          100: 'rgba(0, 0, 0, 0.37)',
          200: 'rgba(196,196,196, 0.21) ',
          300: 'rgba(255, 255, 255, 0.25)',
          400: 'rgba(0, 0, 0, 0.75)',
          500: 'rgba(0, 0, 0, 0.9375)',
          600: 'rgba(59, 59, 59, 0.3)',
          700: 'rgba(0,0,0,0.22)',
          800: 'rgba(59,59,59,0.13)',
        },
      },
      fontSize: {
        // @ts-ignore
        sm: ['0.75rem', { lineHeight: '1rem' }],
        // @ts-ignore
        base: ['0.875rem', { lineHeight: '1.25rem' }],
        // @ts-ignore
        lg: ['1rem', { lineHeight: '1.5rem' }],
        // @ts-ignore
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        // @ts-ignore
        '2xl': ['1.5rem', { lineHeight: '1.75rem' }],
        // @ts-ignore
        'body-xs': ['0.625rem', { lineHeight: '0.75rem' }],
        // @ts-ignore
        'body-sm': ['0.8125rem', { lineHeight: '1rem' }],
        // @ts-ignore
        body: ['0.9375rem', { lineHeight: '1.25rem' }],
        // @ts-ignore
        button: ['1.0625rem', { lineHeight: '1.5rem' }],
        // @ts-ignore
        'heading-sm': ['1.0625rem', { lineHeight: '1.5rem' }],
        // @ts-ignore
        'heading-md': ['1.25rem', { lineHeight: '1.5rem' }],
        // @ts-ignore
        'heading-lg': ['1.5625rem', { lineHeight: '1.75rem' }],
      },
      maxHeight: {
        100: '37.5rem',
        116: '29rem',
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
        0.5: '0.03125rem',
        2.5: '0.625rem',
        3.5: '0.875rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('./node_modules/tailwind-percentage-heights-plugin')()],
};
