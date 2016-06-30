
const path = require('path');
const webpackConfig = require('../webpack.config.js');

module.exports = {
  resolve: webpackConfig.resolve,
  module: {
    loaders: webpackConfig.module.loaders,
  },
  postcss: webpackConfig.postcss,
  plugins: webpackConfig.plugins,
};
