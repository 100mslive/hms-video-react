const postcss = require('rollup-plugin-postcss');
const static_files = require('rollup-plugin-static-files');
const images = require('@rollup/plugin-image');

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
      static_files({
        include: ['./public'],
      }),
    );

    config.plugins.unshift(images());
    return config;
  },
};
