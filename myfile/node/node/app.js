


var express=require("express");

var app=express();
// 
// var hostname="0.0.0.0";
var hostname='localhost'
// var hostname="172.17.199.68";
var port="8000";

var cookieParser=require("cookie-parser");
var bodyParser=require("body-parser");


app.use(bodyParser.json());    // 获取 post 的参数  req.post 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());  // 设置 cookies 中间件 


//跨域问题解决
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

var index=require("./index");

//路径更改处
app.use("/",index);

app.get("/",(req,res)=>{res.send("这是我后端的服务器根路径 ");})

//监听url状态
app.listen(port,hostname,()=>{console.log(`http://${hostname}:${port}`)});