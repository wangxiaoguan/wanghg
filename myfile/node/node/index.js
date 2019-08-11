

var express=require("express");

var {MongoClient}=require("mongodb");

// var CONN_DB_STR="mongodb://localhost:27017/wh1803";
var CONN_DB_STR="mongodb://60.205.201.113:27017/app";

var router=express.Router();

var {waterfall} = require("async");

//路由根据不同的路径跳转不同的页面

router.get("/app",(req,res)=>{ res.send("首页")})

// router.get("/login",(req,res)=>{ res.send("登录成功");})

// router.get("/register",(req,res)=>{ res.send("注册成功");})

router.get("/sort",(req,res)=>{
    // var sortname=req.query.sortid; 
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
        try{
            db.collection("sort").find({},{}).toArray((err,result)=>{
                if(err) throw err;
                res.send(result);
            }) 
        }catch(err){
            console.log(err);
            res.send(err);
            db.close()
        }
    })
})
router.get("/goodsid",(req,res)=>{
    var goodsid=req.query.id; 
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
        try{
            db.collection("all").find({goods_id:goodsid*1},{}).toArray((err,result)=>{
                if(err) throw err;
                res.send(result);
            }) 
        }catch(err){
            console.log(err);
            res.send(err);
            db.close()
        }
    })
})
router.get("/home",(req,res)=>{
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
        try{
            db.collection("home").find({},{}).toArray((err,result)=>{
                if(err) throw err;
                res.send(result);
            }) 
        }catch(err){
            console.log(err);
            res.send(err);
            db.close()
        }
    })
})
router.get("/search",(req,res)=>{

    var msg=unescape(req.query.msg)||"";
  
      MongoClient.connect(CONN_DB_STR,(err,db)=>{
        try{
         
          db.collection("all").find({goods_name:{$regex:msg}},{}).toArray((err,result)=>{
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
  //购物车
  router.get("/getdata",(req,res)=>{
      var query=req.query;
      MongoClient.connect(CONN_DB_STR,(err,db)=>{
        try{
         
          db.collection("goodscar").find(query,{}).toArray((err,result)=>{
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
  //获取收藏商品
  router.get("/getcollect",(req,res)=>{
    var query=req.query;
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
       
        db.collection("collect").find(query,{}).toArray((err,result)=>{
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
  //加入购物车
  router.get("/goodscar",(req,res)=>{
    var userId = req.query.userid;
    var shopId=req.query.id;
    var shopName=req.query.name;
    var shopImg=req.query.img;
    var shopPrice=req.query.price/10;
    // var query=req.query;
    var obj={userid:userId,shopid:shopId,shopname:shopName,shopimg:shopImg,shopprice:shopPrice,num:1}

    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
        waterfall([
          function(callback){
            db.collection("goodscar").find({shopid:shopId,userid:userId},{}).toArray((err,result)=>{
              if(err) throw err;
              if(result.length> 0 ){callback(null,true,result[0].num)}
              else{ callback(null,false,"0")}
            })
          },
          function(arg,sum,callback){
            if(arg){
              db.collection("goodscar").update({shopid:shopId,userid:userId},{$set:{num:sum*1+1}},(err,result)=>{
                if(err) throw err;callback(null,"1"); 
              })            
            }else{
              db.collection("goodscar").insert(obj,(err,result)=>{
                if(err) throw err;callback(null,"2"); 
            })  
            }
          }
        ],(err,result)=>{if(err) throw err;res.send(result);})
      }catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    });
  });
  //收藏商品
  router.get("/collect",(req,res)=>{
    var userId = req.query.userid;
    var shopId=req.query.id;
    var shopName=req.query.name;
    var shopImg=req.query.img;
    var shopPrice=req.query.price/10;
    // var query=req.query;
    var obj={userid:userId,shopid:shopId,shopname:shopName,shopimg:shopImg,shopprice:shopPrice,num:1}

    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
        waterfall([
          function(callback){
            db.collection("collect").find({shopid:shopId,userid:userId},{}).toArray((err,result)=>{
              if(err) throw err;
              if(result.length> 0 ){callback(null,true,result[0].num)}
              else{ callback(null,false,"0")}
            })
          },
          function(arg,sum,callback){
            if(arg){
              db.collection("collect").update({shopid:shopId,userid:userId},{$set:{num:sum*1+1}},(err,result)=>{
                if(err) throw err;callback(null,"1"); 
              })            
            }else{
              db.collection("collect").insert(obj,(err,result)=>{
                if(err) throw err;callback(null,"2"); 
            })  
            }
          }
        ],(err,result)=>{if(err) throw err;res.send(result);})
      }catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    });
  });
  //删除收藏商品
  router.get("/detcol",(req,res)=>{
    var query=req.query
      MongoClient.connect(CONN_DB_STR,(err,db)=>{
        try{
         
          db.collection("collect").deleteOne(query,(err,result)=>{ 
            if(err) throw err;
            
            res.send(result);
          })
  
        } catch(err){
          console.log(err);
          res.send("1");
          db.close()
        }
      })
  });
//删除购物车商品
router.get("/detele",(req,res)=>{
    var query=req.query
      MongoClient.connect(CONN_DB_STR,(err,db)=>{
        try{
         
          db.collection("goodscar").deleteOne(query,(err,result)=>{ 
            if(err) throw err;
            
            res.send(result);
          })
  
        } catch(err){
          console.log(err);
          res.send("1");
          db.close()
        }
      })
  });
  router.get("/updatenum",(req,res)=>{
    var id=req.query.shopId;
    var user=req.query.userid;
    var sum=req.query.num;

      MongoClient.connect(CONN_DB_STR,(err,db)=>{
        try{
         
          db.collection("goodscar").update({userid:user,shopid:id},{$set:{num:sum*1}},(err,result)=>{
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
  //用户注册
  router.get("/register",(req,res)=>{
    var query = req.query;
    
    var insertData = function(db,callback){
      var user = db.collection("user");
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
  //用户登录
  router.get("/login",(req,res)=>{
    var query = req.query;
    // var nameid=req.query.name;
    // var password=req.query.pwd;
    // console.log("千锋教育武汉1803");
    // console.log(req.query);
   
    MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
       
        db.collection("user").find(query,{}).toArray((err,result)=>{ 
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
//   router.get("/shopcar",(req,res)=>{
//     var nameid = req.query.nameId;
//     var shopId=req.query.id;
//     var query=req.query;
//     MongoClient.connect(CONN_DB_STR,(err,db)=>{
//       try{
//         waterfall([
//           function(callback){
//             db.collection("shopcar").find({nameId:nameid,id:shopId},{}).toArray((err,result)=>{
//               if(err) throw err;
//               if(result.length> 0 ){
//                 callback(null,true,result[0].num)
//               }else{
//                 callback(null,false,"0")
//               }
//             })
//           },
//           function(arg,sum,callback){
//             if(arg){
//               db.collection("shopcar").update({nameId:nameid,id:shopId},{$set:{num:sum*1+1}},(err,result)=>{
//                 if(err) throw err;
//                 callback(null,"1"); 
//               })
             
             
//             }else{
//               db.collection("shopcar").insert(query,(err,result)=>{
//                 if(err) throw err;
//                 callback(null,"1"); 
//             })  
//             }
//           }
    
//         ],(err,result)=>{
//           if(err) throw err;
//           res.send(result);
//         })
  
         
  
//       }catch(err){
//         console.log(err);
//         res.send(err);
//         db.close()
//       }
//     });
//   });

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



router.get("/news",(req,res)=>{
  if(req.query){
    var num=req.query.limit*1;
  }else{var num=0}
  

  MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
          db.collection("news").find({},{}).limit(num?num:8).toArray((err,result)=>{
              if(err) throw err;
              res.send(result);
          }) 
      }catch(err){
          console.log(err);
          res.send(err);
          db.close()
      }
  })
})

router.get("/artid",(req,res)=>{
  var id=req.query.id;
  MongoClient.connect(CONN_DB_STR,(err,db)=>{
      try{
          db.collection("news").find({artid:id},{}).toArray((err,result)=>{
              if(err) throw err;
              res.send(result);
          }) 
      }catch(err){
          console.log(err);
          res.send(err);
          db.close()
      }
  })
})

module.exports=router;//导出router