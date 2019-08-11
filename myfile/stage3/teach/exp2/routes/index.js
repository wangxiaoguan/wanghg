var express = require('express');
var router = express.Router();   // app = express()

//expressl 路由模块 

//  get 请求方式 
//  /  路由地址  pathname     path  = pathname + search 
//  req   请求
//  res   响应
//  next  可能执行下一个中间件 

// /node?course=day2

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.write 
  // res.render 渲染模块   res.render(url,option)
  // res.send 
  // res.json 
  console.log(req.session);
  res.render('index', { 
    title: 'Express',
    msg:"1803 so happy" ,
    word:"明天去哪里玩?",
    hello:"你今天smile 了吗?",
    tag:"<h2>你最近想看什么书?</h2>",
    flag:!!1,
    username:req.session.username,
    arr:["西游记","红楼梦","三国演义"]
  });
});


// 读取 login 
router.get("/login",(req,res)=>{
  var username = req.query.username || "";
  res.render("login.ejs",{username});
})

// 读取 register 模块
router.get("/register",(req,res)=>{
  res.render("register.ejs")
})
module.exports = router;
