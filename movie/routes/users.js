var express = require('express');
var router = express.Router();


var {MongoClient} = require("mongodb");
// var CONN_DB_STR = "mongodb://localhost:27017/wh1803";
var CONN_DB_STR = "mongodb://60.205.201.113:27017/wh1803";
var {waterfall} = require("async");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register",(req,res)=>{
  // res.redirect("/login");
  // res.send("数据发送成功success");
  var body = req.body;   // post 提交的数据 req.body;
  console.log(body);
  var insertData = function(db,callback){
    console.log("异步回调");
    var user = db.collection("user");
    // 注册 先判断是否已经注册  
    // 如果没有被注册就直接插入 
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
          res.send("<script>alert('注册失败 用户名已经存在,请重新注册!');window.location.href='/register'</script>")
        }
        if(result=="1"){
          res.redirect("/login?username="+body.username); // 重定向  www.baidu.com/node ==>  www.baidu.com/vue
        }
        db.close();
      })
    }catch(err){
      console.log(err);
    }
  });

});

router.post("/login",(req,res)=>{
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
    console.log("数据库连接success");
    var username = body.username;
    findData(db,(result,body)=>{
     
      if(result.length>0){
        // res.send("登录成功!");
        console.log(req.session);
        req.session.username = body.username;  //设置 用户名 的session
        res.redirect("/")
      }else{
        // res.send("登录失败!");
        console.log(body);
        res.send(`<script>alert('登录失败,请重新登录!');window.location.href="/login?username=${body.username}"</script>`)
      }
     
      db.close();
    })
  })


});

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
