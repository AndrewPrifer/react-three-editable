const postcss = require('rollup-plugin-postcss');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        inject: false,
      })
    );
    config.treeshake.moduleSideEffects = false;
    return config;
  },
};
