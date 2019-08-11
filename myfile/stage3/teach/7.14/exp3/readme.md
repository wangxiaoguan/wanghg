express 
基于 Node.js 平台，快速、开放、极简的 web 开发框架。
(nodeJs+mongoDB+express+bootStrap) 

nodeJs   php java python go c++ c# 

express 
app 
web站   client+server 

Web 应用
Express 是一个基于 Node.js 平台的极简、灵活的 web 应用开发框架，它提供一系列强大的特性，帮助你创建各种 Web 和移动设备应用。


API 
丰富的 HTTP 快捷方法和任意排列组合的 Connect 中间件，让你创建健壮、友好的 API 变得既快速又简单。
req.body  post 
req.query  get  

性能
Express 不对 Node.js 已有的特性进行二次抽象，我们只是在它之上扩展了 Web 应用所需的基本功能。

安装 express 
npm i express -g  全局安装
npm i express-generator -g  安装全局的高版本

express -h
express --version
express -e  express1706    (生成ejs 模板引擎 的工程)
express exp  (生成jade 默认生成jade 模板 )  

handlebars 
artTemplate  



app.set()
app.use() 
app.next()

express 中间件
所谓中间件就是一些 函数/变量 
中间件执行有顺序之分    app.use(req)  app.next() app.use(res) 
中间件 允许 你把执行的结果  通过 next()  传递给下一个中间件 进行执行 



模板引擎  ejs
EJS是一个简单高效的模板语言，通过数据和模板，可以生成HTML标记文本。
可以说EJS是一个JavaScript库，EJS可以同时运行在客户端和服务器端，
客户端安装直接引入文件即可，服务器端用npm包安装


快速编译和渲染
简单的模板标签
自定义标记分隔符
支持文本包含
支持浏览器端和服务器端
模板静态缓存
支持express视图系统


Render(str,data,[option]):直接渲染字符串并生成html
str：需要解析的字符串模板
data：数据
option：配置选项


<% %>流程控制标签
<%= %>输出标签（原文输出HTML标签）
<%- %>输出标签（HTML会被浏览器解析）
<%# %>注释标签
% 对标记进行转义


include(str,data)  引入模板 



