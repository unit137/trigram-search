const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV = 'development' } = process.env;

const isProduction = NODE_ENV === 'production';

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  devServer: {
    publicPath: '/',
    hot: true,
    // TODO remove on webpack-dev-server update
    injectClient: false,
    injectHot: false,
  },
  ...(isProduction ? {} : { devtool: 'cheap-module-source-map' }),
  module: {
    rules: [
      isProduction ? {} : {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          formatter: require('eslint-formatter-friendly'),
          emitWarning: true,
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.browser.json'
        },
      },
    ],
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  output: {
    library: 'Trigram',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './build/browser'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  plugins: [
    ...(isProduction ? [] : [
      new HtmlWebpackPlugin({
        template: './demo/index.html',
        inject: true,
      }),
      new webpack.HotModuleReplacementPlugin(),
    ]),
  ],
};
