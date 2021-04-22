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
      })
    );
    return config;
  },
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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
          light: 'rgba(255, 255, 255, 0.25)',
          dark: 'rgba(0, 0, 0, 0.75)',
          disabled: 'rgba(59, 59, 59, 0.3)',
        },
      },
      fontSize: {
        sm: ['0.75rem', { lineHeight: '1rem' }],
        base: ['0.875rem', { lineHeight: '1.25rem' }],
        lg: ['1rem', { lineHeight: '1.5rem' }],
        xl: ['1.125rem', { lineHeight: '1.5rem' }],
        '2xl': ['1.5rem', { lineHeight: '1.75rem' }],
      },
      maxHeight: {
        100: '37.5rem', 
      },
      width :{
        7.5: '1.875rem',
      },
      scale:{
        '-100':'-1'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('./node_modules/tailwind-percentage-heights-plugin')()],
};
