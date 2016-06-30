/* eslint-disable no-var, object-shorthand */

var root = __dirname;

/**
 * Load dependencies
 */
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

/**
 * Main config
 */
module.exports = {
  resolve: {
    alias: {
      assets: path.join(root, 'assets'),
      tests: path.join(root, 'tests'),
    },
  },
  module: {
    loaders: [
      { // CSS/SASS loader + autoprefixer
        test: /\.s?css$/,
        loader: [
          'style-loader',
          'css-loader?'
            + ['sourceMap', '-minimize', '-autoprefixer'].join('&'),
          'postcss-loader',
          'sass-loader?'
            + ['sourceMap', 'outputStyle=expanded'].join('&'),
        ].join('!'),
      }, { // SVG Icons sprite loader
        test: /\.svg$/,
        loader: [
          'svg-sprite-loader?' + ['name=i-[name]'].join('&'),
          'image-webpack-loader',
        ].join('!'),
      },
    ],
  },
  postcss: function () {
    return [autoprefixer({ browsers: ['last 3 versions', 'IE >= 9', 'Android >= 4'] })];
  },
  plugins: [
    new webpack.ProvidePlugin({
      'window.Sortable': 'sortablejs',
    }),
  ],
};
