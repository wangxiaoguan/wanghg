var express = require('express');   // express模块
var path = require('path');    // node 模块 处理路径
var favicon = require('serve-favicon');   // 处理网站 logo 
var logger = require('morgan');  // 日志处理 
var cookieParser = require('cookie-parser');  // 处理 cookies
var bodyParser = require('body-parser');   //  处理post 请求参数  新版express 把 bodyParser注入到express

var index = require('./routes/index');   // 路由模块 所有路由文件书写在routes 
var users = require('./routes/users');
var comments = require("./routes/comments"); 

// session 用来保存某段时间内用户的行为和相关信息
var session = require("express-session");  

var app = express();   // express 集成各种方法 

// view engine setup
app.set('views', path.join(__dirname, 'views'));   // view == __dirname  根目录  /    ./index.ejs
app.set('view engine', 'ejs'); // 设置模块引擎  ejs 

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  // 设置网站的logo
app.use(logger('dev'));  // 打印日志   dev  开发环境 
app.use(bodyParser.json());    // 获取 post 的参数  req.post 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());  // 设置 cookies 中间件 
app.use(express.static(path.join(__dirname, 'public')));  // express.static 设置express 的静态文件 

app.use(session({
  secret:"recommend 128 bytes random string",  // 密钥 
  cookie:{maxAge:1000*60*20},   // session 存在时长  20min 
  resave:true,  // 自动保存
  saveUninitialized:true  // 保存最新的数据 
}))

app.use('/', index);  // 设置路由中间件    设置路由别名 
app.use('/users', users);   // 路由名称 加上 这个别名 
app.use("/comments",comments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);   // 抓到err 传递下一个中间件 
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);  // 显示错误状态码
  res.render("error");  // render 读取 ejs 模块 
});

module.exports = app;
