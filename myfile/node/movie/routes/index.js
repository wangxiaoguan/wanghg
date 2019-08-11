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



router.get("/home2",(req,res)=>{
  var msgid = req.query.id || "";
  console.log(req.query);
  var obj={};
  if(msgid){
    obj={id:msgid*1}
  }else{
    obj={}
  }
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
       
        db.collection("home2").find(obj,{}).toArray((err,result)=>{ 
          if(err) throw err;
          //  res.render("abc",{result:result})
          res.send(result);
        })

      } catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    })
});

router.get("/home1",(req,res)=>{
  var teatid = req.query.id || "";
  var limit=req.query.limit|| "1";
  console.log(req.query);
  var obj={};
  if(teatid){
    obj={id:teatid*1}
  }else{
    obj={}
  }
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    try{
     
      db.collection("details").find(obj,{}).limit(limit*1).toArray((err,result)=>{ 
        if(err) throw err;
        //  res.render("abc",{result:result})
        res.send(result);
      })

    } catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});
router.get("/gologin",(req,res)=>{
  // var query = req.query;
  var nameid=req.query.name
  console.log("千锋教育武汉1803");
  console.log(req.query);
 
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    try{
     
      db.collection("appuser").find({ $or:[ {name:nameid},{phone:nameid}] },{}).toArray((err,result)=>{ 
        if(err) throw err;
        //  res.render("abc",{result:result})
        res.send(result);
      })

    } catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});
router.get("/goreg",(req,res)=>{
  var query = req.query;
  
  var insertData = function(db,callback){
    var user = db.collection("appuser");
    waterfall([
      function(callback){
        user.find({$or:[ {name:query.name},{phone:query.phone}]},{}).toArray((err,result)=>{
          if(err) throw err;
          if(result.length> 0 ){callback(null,true)
          }else{callback(null,false)}
        })
      },
      function(arg,callback){
        if(!arg){
          // 可以插入user 集合 
          user.insert(query,(err,result)=>{
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
       
          res.send(result)
      
        db.close();
      })
    }catch(err){
      console.log(err);
    }
  });

});



router.get("/culture",(req,res)=>{
  var teatid = req.query.id || "";
  var limit=req.query.limit|| "10"
  console.log(req.query);
  var obj={};
  if(teatid){obj={id:teatid*1}}else{obj={} }

  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    try{
     
      db.collection("culture").find(obj,{}).limit(limit*1).toArray((err,result)=>{ 
        if(err) throw err;
        //  res.render("abc",{result:result})
        res.send(result);
      })

    } catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});


router.get("/goodscar",(req,res)=>{
  var nameid = req.query.nameId;
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
       
        db.collection("shopcar").find({nameId:nameid},{}).toArray((err,result)=>{ 
          if(err) throw err;
          
          res.send(result);
        })

      } catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    })
});
router.get("/shopcar",(req,res)=>{
  var nameid = req.query.nameId;
  var shopId=req.query.id;
  var query=req.query;
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
    try{
      waterfall([
        function(callback){
          db.collection("shopcar").find({nameId:nameid,id:shopId},{}).toArray((err,result)=>{
            if(err) throw err;
            if(result.length> 0 ){
              callback(null,true,result[0].num)
            }else{
              callback(null,false,"0")
            }
          })
        },
        function(arg,sum,callback){
          if(arg){
            db.collection("shopcar").update({nameId:nameid,id:shopId},{$set:{num:sum*1+1}},(err,result)=>{
              if(err) throw err;
              callback(null,"1"); 
            })
           
           
          }else{
            db.collection("shopcar").insert(query,(err,result)=>{
              if(err) throw err;
              callback(null,"1"); 
          })  
          }
        }
  
      ],(err,result)=>{
        if(err) throw err;
        res.send(result);
      })

       

    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  });
});

router.get("/detele",(req,res)=>{
  var query=req.query
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
       
        db.collection("shopcar").deleteOne(query,(err,result)=>{ 
          if(err) throw err;
          
          res.send(result);
        })

      } catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    })
});
router.get("/updatenum",(req,res)=>{
  var nameid = req.query.nameId;
  var shopId=req.query.id;
  var sum=req.query.num;
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
       
        db.collection("shopcar").update({nameId:nameid,id:shopId},{$set:{num:sum}},(err,result)=>{
          if(err) throw err;
          res.send(result);
        })

      } catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    })
});
router.get("/search",(req,res)=>{

  var msg=unescape(req.query.msg)||"";

    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
       
        db.collection("home2").find({title:{$regex:msg}},{}).toArray((err,result)=>{
          if(err)throw err;
          res.send(result);
        })

      } catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    })
});
router.get("/search2",(req,res)=>{

  var msg=unescape(req.query.msg)||"";

    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
       
        db.collection("culture").find({title:{$regex:msg}},{}).toArray((err,result)=>{
          if(err)throw err;
          res.send(result);
        })

      } catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    })
});

var axios=require("axios");

var md5=require("md5");


router.get("/code", (req, res) => {
    var phone = req.query.phone;
    var time=30;
    var code = Math.round(Math.random() * 8999) + 1000;
    // var str = "【周到科技】登录验证码：{"+code+"}，如非本人操作，请忽略此短信。"
    var str ="【宏观科技】您的验证码为{"+code+"}，请于{"+time+"}分钟内正确输入，如非本人操作，请忽略此短信。"
    axios.post("https://api.miaodiyun.com/20150822/industrySMS/sendSMS", {
    }, {
            params: {
                'accountSid': 'ecc49395b9594ce7a5cf57eee88b89fa',//秒滴ACCOUNT SID
                'smsContent': str,//短信模版+验证码
                'to': phone,//手机号
                'timestamp': '20180803074806',//时间戳
                'sig': md5('ecc49395b9594ce7a5cf57eee88b89faefd6db96f35047d2bf893c9c28ac8c2520180803074806'),//用md5加密的  ACCOUNT SID+AUTH TOKEN+时间戳 要导入md5-node
                'respDataType': 'JSON'
            }
        }).then((result) => {
            console.log("result--------------------------" + result.data.respCode)
            if (result.data.respCode == "00000") {
                res.json({
                    code,
                    respCode: '操作成功'
                })
            } else {
                res.json({
                    code: "请求失败",
                    respCode: '操作成功'
                })
            }
        })
})









module.exports = router;
