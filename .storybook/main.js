const path = require('path');

function regexEqual(x, y) {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
}

module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true, // type-check stories during Storybook build
  },
  webpackFinal: async (config, { configType }) => {
    let oldCssRule;
    config.module.rules.forEach((rule) => {
      if (regexEqual(rule.test, /\.css$/)) {
        oldCssRule = { ...rule };
        oldCssRule.use = [...rule.use];
        rule.use.shift();
        rule.use.unshift('to-string-loader');
      }
    });

    oldCssRule.test = /\.globalcss$/;
    config.module.rules.push(oldCssRule);

    return config;
  },
};
