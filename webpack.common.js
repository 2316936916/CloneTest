/* eslint import/no-extraneous-dependencies: 0 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

const distName = path.resolve(__dirname, 'dist');

module.exports = {
  output: {
    filename: '[name].js',
    path: distName,
    publicPath: '/static/tender/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 40 * 1024,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: 'raw-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        polyfill: {
          test: ({ resource }) => resource && /node_modules\/@babel/.test(resource),
          name: 'polyfill',
          enforce: true,
          priority: 12,
        },
        react: {
          test: ({ resource }) => resource && /node_modules\/(react|prop-types)/.test(resource),
          name: 'react',
          enforce: true,
          priority: 10,
        },
        lib: {
          test: ({ resource }) => resource && /node_modules\/lodash|dayjs\//.test(resource),
          name: 'lib',
          enforce: true,
          priority: 9,
        },
        icons: {
          test: ({ resource }) => resource
            && resource === path.resolve(__dirname, 'src', 'components', 'Icon', 'icons.json'),
          name: 'icons',
          enforce: true,
          priority: 6,
        },
        vendor: {
          test: ({ resource }) => resource && resource.indexOf(path.join(__dirname, 'node_modules')) === 0,
          name: 'vender',
          enforce: true,
          priority: 5,
        },
      },
    },
    runtimeChunk: true,
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src', 'pages'),
      'node_modules',
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __BASE_PATH__: JSON.stringify('/tender'),
      RESOURCE_PATHNAME_UPLOAD: JSON.stringify('/upload'),
      RESOURCE_PATHNAME_GET: JSON.stringify('/resource'),
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      meta: {
        viewport: 'width=device-width, initial-scale=1, user-scalable=no',
        charset: 'utf-8',
      },
      templateContent:
        '<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>',
    }),
  ],
};
