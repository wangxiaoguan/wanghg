var webpack = require('webpack');
var merge = require('@ersinfotech/merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpackConfig = require('./webpack.config');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

//process.env.NODE_ENV = 'production';

module.exports = merge(webpackConfig, {
  mode: 'production',
  devtool: 'source-map',
  cache: false,
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          }
        }
      })
    ]
  },
  module: {
    rules: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
      }),
      // exclude: /components/,
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', {
          loader: 'less-loader',   // compiles Less to CSS
          options: {
            // 这里配置全局变量
            modifyVars: {
              // 修改图标库为本地离线，而不是阿里云CDN上的图标资源 
              "@icon-url": '"/iconfont/iconfont"'
            }
          }
        }],
        // publicPath:'',
      }),
    }],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name]_[hash].css',
      allChunks: true,
      disable: false,
    }),
  ],
});
