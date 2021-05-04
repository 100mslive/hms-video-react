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
  theme: require('./defaultTheme.ts').theme,
  variants: {
    extend: {},
  },
  plugins: [require('./node_modules/tailwind-percentage-heights-plugin')()],
};
