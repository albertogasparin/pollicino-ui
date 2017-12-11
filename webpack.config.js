/* eslint-disable no-var, object-shorthand */

var root = __dirname;

/**
 * Load dependencies
 */
var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

var supportedBrowsers = ['last 3 versions', 'IE >= 11', 'Android >= 4.4'];

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
    rules: [
      {
        // JS/JSX loader + hot reload
        test: /\.jsx?$/,
        include: path.join(root, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        // CSS/SASS loader + autoprefixer
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: { convertToAbsoluteUrls: true },
          },
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer({ browsers: supportedBrowsers })],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
            },
          },
        ],
      },
      {
        // SVG Icons sprite loader
        test: /\.svg$/,
        include: [path.join(root, 'assets', 'icons')],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: { symbolId: 'i-[name]' },
          },
          {
            loader: 'image-webpack-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      'window.Sortable': 'sortablejs',
    }),
  ],
};
