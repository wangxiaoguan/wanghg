

// 项目工程模块化 
// webpack
// 打包JS
// 模块化css/scss/less
// 模块打包 png/jpg/jpeg
// 模块 单文件组件  app.vue 

console.log("react-webpack");
const path = require("path"); // node 模块
const webpack = require("webpack");
const htmlWebpackPlugin = require("html-webpack-plugin");   // 操作html 
const openBrowserWebpackPlugin = require("open-browser-webpack-plugin") // 自动打开浏览器 
const ExtractTextPlugin = require("extract-text-webpack-plugin");  // 抽离样式
module.exports = {
    entry:['./src/index.js'],  // 入口文件  

    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"js/[name].[hash:8].js",  // hash:8 md5 加密生成 hash 加密算法 得到8长度 字符串  防止缓存  
        publicPath:"", // 公共路径      css / js 添加公共路径 上线需要用到 
    },
    resolve:{
        alias:{   // 别名 
            "react":path.join(__dirname,"node_modules","react")
        }
    },
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                use:["babel-loader"]
            },
            {
                test:/\.(css|scss)$/,
                use:ExtractTextPlugin.extract({
                    fallback:"style-loader",  // css node(commonJS )风格的 string 
                    use:[ "css-loader",  //   把 css 转义成  commonJS 规范的js 代码 
                        {
                            loader:"postcss-loader", // 转成 css 风格代码
                            options:{
                                plugins:function(){
                                    return [
                                        require("cssgrace"),   // 美化css 缩进
                                        require("postcss-px2rem-exclude")({
                                            remUnit: 100,
                                            exclude: /antd-mobile/i  // 排除antd-mobile 里面rem 转换 
                                        }),          // px 转 rem  
                                        require("autoprefixer")() // 自动补全 moz ms webkit
                                    ]
                                }
                            }
                        },
                        "sass-loader", // scss 编译 
                    ]
                })
            },
            {
                test:/\.(jpeg|png|gif|jpg|svg|woff|woff2|eot|ttf)\??.*$/,
                use:["url-loader?limit=8192&name=font/[hash:8].[name].[ext]"]
            }
        ]
    },

    devtool:"source-map",


    // 服务器 webpack-dev-server 
    devServer:{
        contentBase:path.join(__dirname,"dist"),  // 服务器 作用于 dist 文件夹 
        compress:true,
        hot:true,
        // open:true, // 自动打开浏览器
        host:"localhost",  // 0.0.0.0 
        port:5000,
        publicPath:"",  // 公共路径
        historyApiFallback:true, // history html5 api 
        disableHostCheck:true 
    },

    // webpack 插件 plugin
    plugins:[

        new htmlWebpackPlugin({
            template:"./src/index.html",  // 指明编译的html 
            inject:true // 自动注入 css / js 
        }),

        new openBrowserWebpackPlugin({
            url:"http://localhost:5000"
        }),


        new ExtractTextPlugin({
            filename:"css/app.[hash:8].css", // 抽离文件 名称 
            allChunks:true , // 抽离全部数据
            disable:false  ,   // true 无法抽离 
        }),

        new webpack.HotModuleReplacementPlugin()    //  实现模块热替换 热更新
    ]


}