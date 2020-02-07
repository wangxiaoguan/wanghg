var createError = require('http-errors');
var express = require('express');//express模块
var path = require('path'); //node 模块 处理路径
var cookieParser = require('cookie-parser');//处理cookie
var logger = require('morgan');//日志处理

var indexRouter = require('./routes/index');//路由模块 所有路由文件鞋子routes
var usersRouter = require('./routes/users');
var comments=require('./routes/comments');

// session 用来保存某段时间内用户的行为和相关信息
var session = require("express-session");  

var app = express();//express继承各种方法

// view engine setup
app.set('views', path.join(__dirname, 'views'));  //view==_dirname根目录
app.set('view engine', 'ejs');//设置模块引擎 ejs

app.use(logger('dev'));//打印日志 dev 开发环境
app.use(express.json());//获取post的参数 req.post
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());//设置cookies 中间件
app.use(express.static(path.join(__dirname, 'public')));//express.static 设置express静态文件


app.use(session({
  secret:"recommend 128 bytes random string",  // 密钥 
  cookie:{maxAge:1000*60*20},   // session 存在时长  20min 
  resave:true,  // 自动保存
  saveUninitialized:true  // 保存最新的数据 
}))

//跨域问题解决
app.all('*',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  next();
});


app.use('/', indexRouter);//设置路由中间件
app.use('/users', usersRouter);
app.use('/comments',comments);

// app.use('/users', users);   // 路由名称 加上 这个别名 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);//显示错误状态码
  res.render('error');//reader读取ejs模块
});

module.exports = app;
