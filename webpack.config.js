const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const settings = require('./settings');

console.log('Webpack mode:', settings.mode); // eslint-disable-line no-console

const config = {
  devtool: 'source-map',
  entry: [
    './src/index.js'
  ],
  mode: settings.mode,
  output: {
    path: settings.buildDestination,
    filename: settings.name + '.js',
    libraryTarget: 'umd'
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
    new CopyWebpackPlugin([
      'src/' + settings.name + '.qext'
    ], {}),
    new StyleLintPlugin()
  ]
};

module.exports = config;
