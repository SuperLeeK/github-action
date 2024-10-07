const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // 엔트리 포인트를 main.js로 변경
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        // { from: 'src/index.html', to: 'index.html' },
        { from: 'src/main.js', to: 'main.js' },
        { from: 'src/counter.js', to: 'counter.js' },
        { from: 'src/counterConfig.js', to: 'counterConfig.js' },
        { from: 'src/styles.css', to: 'styles.css' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),
  ],
};