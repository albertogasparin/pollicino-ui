
const path = require('path');
const webpackConfig = require('../webpack.config.js');

module.exports = {
  resolve: webpackConfig.resolve,
  module: {
    rules: webpackConfig.module.rules,
  },
  plugins: webpackConfig.plugins,
};
