// 项目工程模块化
// webpack
// 打包JS
// 模块化css/scss/less
// 模块打包 png/jpg/jpeg
// 模块 单文件组件  app.vue

console.log("react-webpack");
const path = require("path"); // node 模块
const webpack = require("webpack");

const htmlWebpackPlugin = require("html-webpack-plugin"); // 操作html
const openBrowserWebpackPlugin = require("open-browser-webpack-plugin"); // 自动打开浏览器
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 抽离样式


// const proxyConfig = {
//     development:'http://10.128.151.130/workReport',
//     production:'http://10.128.151.130/workReport',
// };


const isDev = process.env.environment === 'development';

const IpConfig = isDev ? 'http://10.128.151.130': '' ;

console.log(`******当前环境：${process.env.environment} ****** 代理地址：${IpConfig} *****`)




module.exports = {
  // entry: ["./src/index.js"], // 入口文件
  entry: {
    // common: ['lodash'],
    app: './src/index.js',
    vendors: [
      'react', 
      "react-dom",
      "react-router-dom",
      "redux",
      "react-redux",
      "antd",
      "moment",
      "md5",
      "jquery"
    ]
    // vendors: [
    //   'react', 
    //   "react-dom",
    //   "http-proxy-middleware",
    //   "react-router-dom",
    //   "redux",
    //   "react-redux",
    //   "antd",
    //   "moment",
    //   "md5",
    //   "jquery"
    // ]
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[hash:8].js", // hash:8 md5 加密生成 hash 加密算法 得到8长度 字符串  防止缓存
    publicPath: "", // 公共路径      css / js 添加公共路径 上线需要用到
  },
  resolve: {
    alias: {
      // 别名
      react: path.join(__dirname, "node_modules", "react"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(css|scss)$/,
        // use:["style-loader","css-loader","sass-loader" ]
        use: [
          {
            loader: "style-loader", // 将 JS 字符串生成为 style 节点
          },
          {
            loader: "css-loader", // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: "sass-loader", // 将 Sass 编译成 CSS
          },
        ],
      },
      {
        test: /\.(mp4|png|gif|jpg|svg|woff|woff2|eot|ttf)\??.*$/,
        use: ["url-loader?limit=8192&name=font/[hash:8].[name].[ext]"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.html$/,
        use: [
          {
            // loader:'html-loader'
            loader: require.resolve("html-loader"),
          },
        ],
      },
    ],
  },

  devtool: "source-map",

  // 服务器 webpack-dev-server
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    historyApiFallback: true,
    clientLogLevel: "none",
    hot: true,
    inline: true,
    progress: true,
    port: 5000,
    host: "localhost",
    noInfo: true,
    proxy: {
      "/workReport": {
        target: IpConfig,
        changeOrigin: true,
        pathRewrite: {'^/workReport': isDev ? '/workReport' : '/'}
      },
    },
  },

  // webpack 插件 plugin
  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html", // 指明编译的html
      inject: true, // 自动注入 css / js
    }),

    new openBrowserWebpackPlugin({
      url: "http://localhost:5000/",
    }),

    new ExtractTextPlugin({
      filename: "css/app.[hash:8].css", // 抽离文件 名称
      allChunks: true, // 抽离全部数据
      disable: false, // true 无法抽离
    }),

    new webpack.HotModuleReplacementPlugin(), //  实现模块热替换 热更新

    //使用ProvidePlugin加载使用频率高的模块
    new webpack.ProvidePlugin({
      Demo: {},
    }),
    new webpack.optimize.CommonsChunkPlugin({
      // name: 'common',  // 指代index.js引入的lodash库
      // name: 'vendors',
      // filename: 'js/[name].[hash:4].js'//生成的vendors文件就是以这样的形式命名
      names: [
        'react', 
        "reactDom",
        "reactRouterDom",
        "redux",
        "reactRedux",
        "antd",
        "moment",
        "md5",
        "jquery"
      ]
    })
  ],
};
