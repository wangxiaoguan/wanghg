var express = require('express');
var router = express.Router();
var {waterfall} = require("async");

var {MongoClient} = require("mongodb");
// var CONN_DB_STR = "mongodb://localhost:27017/wh1803";
var CONN_DB_STR = "mongodb://60.205.201.113:27017/wh1803";
//get 请求方式
//路由地址  pathname path
//req 请求
//res 响应
//next 可能执行下一个中间件
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',
  flag:!!1,
  username:req.session.username, });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/register",(req,res)=>{
  res.render("register");
});

router.get("/login",(req,res)=>{
  var username = req.query.username || "";
  req.session.username = username;
  res.render("login",{ username })
});


router.get("/layout",(req,res)=>{

  
  // method 1
  // req.session.username = "";
  // res.redirect("/");

  // method 2
  req.session.destroy((err)=>{
    if(err) throw err;
    res.redirect("/");
  })
  
})


router.get("/cancel",(req,res)=>{
  res.render("cancel");
});


router.get("/movie",(req,res)=>{
  var username = req.session.username;
  req.session.username = username;
  var filed = req.query.filed || "";
  var sort = req.query.sort*1 || 1;
  if(username){
    // 访问movie 集合
    var obj = {};  
    // filed&&filed? obj[filed] = sort:obj={}
    if(filed){ obj[filed] = sort;
    }else{  obj = {}  }
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

});

module.exports = router;
