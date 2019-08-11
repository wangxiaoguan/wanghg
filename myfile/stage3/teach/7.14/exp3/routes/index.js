var express = require('express');
var router = express.Router();   // app = express()

var {MongoClient} = require("mongodb");
var CONN_DB_STR = "mongodb://localhost:27017/wh1803";

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

router.get("/logout",(req,res)=>{

  
  // method 1
  // req.session.username = "";
  // res.redirect("/");

  // method 2
  req.session.destroy((err)=>{
    if(err) throw err;
    res.redirect("/");
  })
  
})


router.get("/movie",(req,res)=>{
  var username = req.session.username;
  var filed = req.query.filed || "";
  var sort = req.query.sort*1 || 1;
  if(username){
    // 访问movie 集合
    var obj = {};  
    // filed&&filed? obj[filed] = sort:obj={}
    if(filed){
      obj[filed] = sort;
    }else{
      obj = {}
    }
    console.log(obj);
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
        console.log("successful");
        db.collection("movie").find({},{title:1,id:1,year:1,'rating.average':1,genres:1,'directors.name':1,"images.large":1})
        .sort(obj)
        .toArray((err,result)=>{
          if(err) throw err;
          // console.log(result)
           res.render("movie",{result:result})
        })

      } catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    })
  }else{
    res.send("<script>alert('session已经过期,请重新登录!');window.location.href='/login'</script>")
  }

  // res.render("movie")
})
module.exports = router;
