const StyleLintPlugin = require('stylelint-webpack-plugin');
const packageJSON = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const SOURCE_MAP = 'sourec-map';
const DEVTOOL = (process.env.NODE_ENV === 'development') ? SOURCE_MAP : false;

const DIST = path.resolve("./dist");
const MODE = process.env.NODE_ENV || 'development';

console.log('Webpack mode:', MODE); // eslint-disable-line no-console

const config = {
  devtool: DEVTOOL,
  entry: [
    './src/index.js'
  ],
  mode: MODE,
  output: {
    filename: `${packageJSON.name}.js`,
    libraryTarget: 'amd',
    path: DIST
  },
  externals: {
    qlik: {
      amd: 'qlik',
      commonjs: 'qlik',
      commonjs2: 'qlik',
      root: '_'
    }
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "eslint-loader",
        options: {
          failOnError: true
        }
      },
      {
        test: /node_modules[\\\/]vis[\\\/].*\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /.(less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      }
    ]
  },
  plugins: [
    new StyleLintPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/en$/),
  ]
};

module.exports = config;
