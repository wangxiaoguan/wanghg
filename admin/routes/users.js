

var express = require('express');
var router = express.Router();
var {MongoClient} = require("mongodb");
var CONN_DB_STR = "mongodb://localhost:27017/manage";
// var CONN_DB_STR = "mongodb://60.205.201.113:27017/manage";
var {waterfall} = require("async");

// router.get('/', function(req, res, next) {
//   res.render("login");
// });

//用户注册
router.get('/register', (req, res)=>{
  res.render("register");
});
router.post("/register",(req,res)=>{
  var body = req.body;
  console.log(body);
  var insertData = function(db,callback){
    console.log("异步回调");
    var user = db.collection("user");
    waterfall([
      function(callback){
        user.find({username:body.username},{}).toArray((err,result)=>{
          if(err) throw err;
          if(result.length> 0 ){
            callback(null,true)
          }else{
            callback(null,false)
          }
        })
      },
      function(arg,callback){
        if(!arg){
          // 可以插入user 集合 
          user.insert(body,(err,result)=>{
              if(err) throw err;
              callback(null,"1");  // 1 注册成功
          })
        }else{
          callback(null,"0");  // 0 注册失败 用户名已经存在 
        }
      }

    ],(err,result)=>{
      if(err) throw err;
      callback(result);
    })
  }

  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    try{
      console.log("数据库连接成功");
      insertData(db,(result)=>{
        if(result=="0"){
          res.send("<script>alert('注册失败 用户名已经存在,请重新注册!');window.location.href='/users/register'</script>")
        }
        if(result=="1"){
          // res.render("login",{username});
          res.redirect("/login?username="+body.username); // 重定向  www.baidu.com/node ==>  www.baidu.com/vue
        }
        db.close();
      })
    }catch(err){
      console.log(err);
    }
  });

});
//用户登录
// router.get("/login",(req,res)=>{

router.post("/login",(req,res)=>{
  // res.send("数据发送成功success");
  var body = req.body;

  var username=req.body.username;
  var password=req.body.password;
  var person=req.body.person;
  console.log(body);

  var findData = function(db,callback){
      db.collection("user").find({username:username,password:password},{}).toArray((err,result)=>{
          if(err) throw err;
          callback(result);
      })
  }

  
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    if(err) throw err;
    console.log("数据库连接success");
    var username = req.body.username;
    findData(db,(result)=>{
     
      if(result.length>0){
        // res.send("登录成功!");
        console.log(req.session);
        req.session.username =username;  //设置 用户名 的session
        if(person==1){
          res.render("index",{username});
        }else{
          res.redirect("/personmsg");
        }
        
      }else{
        // res.send("登录失败!");
        console.log(body);
        res.send(`<script>alert('账号不存在或密码错误,请重新登录!');window.location.href="/login"</script>`)
      }
     
      db.close();
    })
  })


});
//用户退出
router.post("/cancel",(req,res)=>{
  // res.send("数据发送成功success");
  var body = req.body;
  console.log(body);

  var findData = function(db,callback){
      console.log(body);
      db.collection("user").find(body,{}).toArray((err,result)=>{
          if(err) throw err;
          callback(result,body);
      })
  }

  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    if(err) throw err;
    console.log("数据库连接成功-------------------------------------------");
    var username = body.username;
    findData(db,(result,body)=>{
     
      if(result.length>0){
        db.collection("user").deleteOne(body,(err,result)=>{
          if(err) throw err;
         console.log(result);
      })
        res.send(`注销账号成功`)
        // res.redirect("/")
      }else{
        // res.send("登录失败!");
        // console.log(body);
        res.send(`注销账号失败`)
      }
     
      db.close();
    })
  })


});



module.exports = router;
