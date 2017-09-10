const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: __dirname,
  target: 'web',
  entry: './src/index',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.join(__dirname, 'src'),
        ],
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins: [
            ['transform-react-jsx', { 'pragma': 'h' }],
            ['transform-runtime', {
              'helpers': false,
              'polyfill': true,
              'regenerator': true,
              'moduleName': 'babel-runtime',
            }],
            'transform-object-rest-spread'
          ],
        },
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Ghoul - Github Trending',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 9000,
    proxy: {
      '/api': 'http://localhost:3000',
    },
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    https: false,
    noInfo: true,
  },
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-source-map',
};