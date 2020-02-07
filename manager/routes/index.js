


var express = require("express");
var router = express.Router();
var {MongoClient} = require("mongodb");
var CONN_BD_STR = "mongodb://60.205.201.113:27017/manage";
// var CONN_BD_STR = "mongodb://localhost:27017/manage";
var ObjectID = require("mongodb").ObjectID;
var async = require("async");
var multiparty = require("multiparty");
var fs =require("fs");


function setDate(date){
  var year=date.getFullYear();
  var month=date.getMonth()+1;
  var day=date.getDate();
  var hour=date.getHours();
  var min=date.getMinutes();
  var sec=date.getSeconds();
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}


router.get('/', function(req, res, next) {
  res.render("login", { title: 'Express',
  flag:!!1,
  username:req.session.username, });
});

router.get("/login",(req,res)=>{
  var username = req.query.username || "";
  req.session.username = username;
  res.render("login",{ username })
});


router.get("/layout",(req,res)=>{
  // req.session.username = "";
  // res.redirect("/");
  req.session.destroy((err)=>{
    if(err) throw err;
    res.redirect("/login");
  })
})


// 进货账单管理
router.get("/billList",(req,res)=>{
  var username=req.session.username;
  if(username){
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var billList = db.collection("billList");
            async.series([
            function(callback){
              billList.find({},{}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;
                    // console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false)
                    }
                })
            },function(callback){
                if(count>0){
                  billList.find({},{}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum)
                    .toArray((err,result)=>{
                        if(err)throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
                }else{
                    callback(null,[]);
                }
            }],(err,result)=>{
                    if(err)throw err;
                    // console.log(result);
                    res.render("billList",{result:result[1],count,pageNo,totalpage,username})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}

});
//进货账单查询
router.get("/billquery",(req,res)=>{
    var username=req.session.username;
    if(username){
    var goodsname=unescape(req.query.goodsname)||"";
    var payment=unescape(req.query.payment)||"";
    console.log(goodsname);
    var count=0;//总条数
    var totalpage=0;//总页数
    var pagenum=10;//每页显示的页数
    var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
    MongoClient.connect(CONN_BD_STR,(err,db)=>{
            try{
              var billList = db.collection("billList");
              async.series([
              function(callback){
                billList.find({no2:{$regex:goodsname},no5:{$regex:payment}}).toArray((err,result)=>{
                      if(err)throw err;
                      count=result.length;                       
                      console.log(count);
                      if(count>0){
                          totalpage=Math.ceil(count/pagenum);
                          pageNo=pageNo<=1?1:pageNo;
                          pageNo=pageNo>=totalpage?totalpage:pageNo;
                          callback(null,true);
                      }else{
                          callback(null,false)
                      }
                  })
              },function(callback){
                if(count>0){
                  billList.find({no2:{$regex:goodsname},no5:{$regex:payment}}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum)
                    .toArray((err,result)=>{
                        if(err)throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
                }else{
                    callback(null,[]);
                }
              }],(err,result)=>{
                      if(err)throw err;
                      res.render("billquery",{result:result[1],count,pageNo,totalpage,goodsname,payment,username})
                  })
      
            } catch(err){
              console.log(err);
              res.send(err);
              db.close()
            }
          })
        }else{res.send("<script>window.location.href='/login'</script>")}
});
//进货账单金额排序
router.get("/billsort",(req,res)=>{
  var username=req.session.username;
  if(username){
  var order=(req.query.order)*1;
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var billList = db.collection("billList");
            async.series([
            function(callback){
              billList.find({},{}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;
                    // console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false)
                    }
                })
            },function(callback){
                if(count>0){
                  billList.find({},{}).skip((pageNo-1)*pagenum).limit(pagenum).sort({no4:order})
                    .toArray((err,result)=>{
                        if(err)throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
                }else{
                    callback(null,[]);
                }
            }],(err,result)=>{
                    if(err)throw err;
                    // console.log(result);
                    res.render("billsort",{result:result[1],count,pageNo,totalpage,username,order})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}

});
//进货账单添加订单
router.get("/billAdd",(req,res)=>{
  var username=req.session.username;
  if(username){
  res.render("billAdd",{username});
}else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/billAdd2",(req,res)=>{
  var body=req.body;
  // console.log(body);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("billList").insert(body,(err,result)=>{
              if(err)throw err;
              res.redirect("billList");
          })
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
 
});
//进货账单查看
router.get("/billView",(req,res)=>{
  var username=req.session.username;
  if(username){
  var id=req.query._id;
  id=ObjectID.createFromHexString(id)
  console.log(id);

  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("billList").findOne({_id:id},{},(err,result)=>{
              if(err)throw err;
              // console.log(result);
              res.render("billView",{result,username});
          })

    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })

  }else{res.send("<script>window.location.href='/login'</script>")}
});
//进货账单修改
router.get("/billUpdate",(req,res)=>{
  var username=req.session.username;
  if(username){
  var id=req.query._id;
  id=ObjectID.createFromHexString(id)
  console.log(id);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("billList").findOne({_id:id},{},(err,result)=>{
              if(err)throw err;
              // console.log(result);
              res.render("billUpdate",{result,username});
          })

    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
  }else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/billUpdate2",(req,res)=>{
  var id=req.query._id;
  id=ObjectID.createFromHexString(id);
  var body=req.body;

  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("billList").update({_id:id},{$set:body},(err,result)=>{
        if(err) throw err;
        res.redirect("billList");
        db.close();})
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});
//进货账单删除
router.get("/billDelete",(req,res)=>{
  var id=req.query._id;
  id=ObjectID.createFromHexString(id);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{

      db.collection("billList").deleteOne({_id:id},(err,result)=>{
        if(err) throw err;
        res.redirect("billList");
        db.close();})
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
//售货账单管理
router.get("/salelist",(req,res)=>{
  var username=req.session.username;
if(username){ 
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var saleList = db.collection("saleList");
            async.series([
            function(callback){
              saleList.find({},{}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;
                    console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false)
                    }
                })
            },function(callback){
                if(count>0){
                  saleList.find({},{}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum)
                    .toArray((err,result)=>{
                        if(err)throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
                }else{
                    callback(null,[]);
                }
            }],(err,result)=>{
                    if(err)throw err;
                    // console.log(result);
                    res.render("saleList",{result:result[1],count,pageNo,totalpage,username})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}
});
//售货账单查询
router.get("/salequery",(req,res)=>{
  var username=req.session.username;
  if(username){ 
  var name=unescape(req.query.username)||"";
  var number=unescape(req.query.number)||"";

  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var salelist = db.collection("saleList");
            async.series([
            function(callback){
              salelist.find({no2:{$regex:name},no1:{$regex:number}}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;                       
                    console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false)
                    }
                })
            },function(callback){
              if(count>0){
                salelist.find({no2:{$regex:name},no1:{$regex:number}}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum)
                  .toArray((err,result)=>{
                      if(err)throw err;
                      console.log("查询当前页面数据成功");
                      callback(null,result);
                  })
              }else{
                  callback(null,[]);
              }
            }],(err,result)=>{
                    if(err)throw err;
                    res.render("salequery",{result:result[1],count,pageNo,totalpage,username,number,name})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}
});
//售货账单金额排序
router.get("/salesort",(req,res)=>{
  var username=req.session.username;
  if(username){
  var order=(req.query.order)*1;
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var billList = db.collection("saleList");
            async.series([
            function(callback){
              billList.find({},{}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;
                    // console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false)
                    }
                })
            },function(callback){
                if(count>0){
                  billList.find({},{}).skip((pageNo-1)*pagenum).limit(pagenum).sort({no4:order})
                    .toArray((err,result)=>{
                        if(err)throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
                }else{
                    callback(null,[]);
                }
            }],(err,result)=>{
                    if(err)throw err;
                    // console.log(result);
                    res.render("salesort",{result:result[1],count,pageNo,totalpage,username,order})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}

});
//售货账单添加
router.get("/saleAdd",(req,res)=>{
  var username=req.session.username;
  if(username){ 
  res.render("saleAdd",{username});
  }else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/saleAdd2",(req,res)=>{
  var body=req.body;
  // console.log(body);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("saleList").insert(body,(err,result)=>{
              if(err)throw err;
              res.redirect("saleList");
          })
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
 
});
//售货账单查看
router.get("/saleView",(req,res)=>{
  var username=req.session.username;
  if(username){ 
  var id=req.query._id;
  id=ObjectID.createFromHexString(id)
  console.log(id);

  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("saleList").findOne({_id:id},{},(err,result)=>{
              if(err)throw err;
              // console.log(result);
              res.render("saleView",{result,username});
          })

    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
}else{res.send("<script>window.location.href='/login'</script>")}
});
//售货账单修改
router.get("/saleUpdate",(req,res)=>{
  var username=req.session.username;
if(username){ 
  var id=req.query._id;
  id=ObjectID.createFromHexString(id)
  console.log(id);

  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("saleList").findOne({_id:id},{},(err,result)=>{
              if(err)throw err;
              // console.log(result);
              res.render("saleUpdate",{result,username});
          })

    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
}else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/saleUpdate2",(req,res)=>{
  var id=req.query._id;
  id=ObjectID.createFromHexString(id);
  var body=req.body;
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("saleList").update({_id:id},{$set:body},(err,result)=>{
        if(err) throw err;
        res.redirect("saleList");
        db.close();})
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});
//售货账单删除
router.get("/saleDelete",(req,res)=>{
  var id=req.query._id;
  id=ObjectID.createFromHexString(id);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{

      db.collection("saleList").deleteOne({_id:id},(err,result)=>{
        if(err) throw err;
        res.redirect("saleList");
        db.close();})
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })

});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


// 供应商管理
router.get("/providerList",(req,res)=>{
  var username=req.session.username;
if(username){ 
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var providerList = db.collection("providerList");
            async.series([
            function(callback){
              providerList.find({},{}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;
                    console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false)
                    }
                })
            },function(callback){
                if(count>0){
                  providerList.find({},{}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum)
                    .toArray((err,result)=>{
                        if(err)throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
                }else{
                    callback(null,[]);
                }
            }],(err,result)=>{
                    if(err)throw err;
                    // console.log(result);
                    res.render("providerList",{result:result[1],count,pageNo,totalpage,username})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}
});
//供应商查询
router.get("/providerquery",(req,res)=>{
  var username=req.session.username;
if(username){
  var name=unescape(req.query.username)||"";
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var salelist = db.collection("providerList");
            async.series([
            function(callback){
              salelist.find({no2:{$regex:name}}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;                       
                    console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false)
                    }
                })
            },function(callback){
              if(count>0){
                salelist.find({no2:{$regex:name}}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum)
                  .toArray((err,result)=>{
                      if(err)throw err;
                      console.log("查询当前页面数据成功");
                      callback(null,result);
                  })
              }else{
                  callback(null,[]);
              }
            }],(err,result)=>{
                    if(err)throw err;
                    res.render("providerquery",{result:result[1],count,pageNo,totalpage,username,name})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}
});
//添加供应商
router.get("/providerAdd",(req,res)=>{
  var username=req.session.username;
if(username){ 
  res.render("providerAdd",{username});
}else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/providerAdd2",(req,res)=>{
  var body=req.body;
  // console.log(body);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("providerList").insert(body,(err,result)=>{
              if(err)throw err;
              res.redirect("providerList");
          })
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
 
});
//供应商查看
router.get("/providerView",(req,res)=>{
  var username=req.session.username;
if(username){ 
  var id=req.query._id;
  id=ObjectID.createFromHexString(id)
  console.log(id);

  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("providerList").findOne({_id:id},{},(err,result)=>{
              if(err)throw err;
              // console.log(result);
              res.render("providerView",{result,username});
          })

    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
}else{res.send("<script>window.location.href='/login'</script>")}
});
//供应商修改
router.get("/providerUpdate",(req,res)=>{
  var username=req.session.username;
if(username){
  var id=req.query._id;
  id=ObjectID.createFromHexString(id)
  console.log(id);

  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("providerList").findOne({_id:id},{},(err,result)=>{
              if(err)throw err;
              // console.log(result);
              res.render("providerUpdate",{result,username});
          })

    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
}else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/providerUpdate2",(req,res)=>{
  var id=req.query._id;
  id=ObjectID.createFromHexString(id);
  var body=req.body;
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("providerList").update({_id:id},{$set:body},(err,result)=>{
        if(err) throw err;
        res.redirect("providerList");
        db.close();})
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});
//供应商删除
router.get("/providerDelete",(req,res)=>{
  var id=req.query._id;
  id=ObjectID.createFromHexString(id);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{

      db.collection("providerList").deleteOne({_id:id},(err,result)=>{
        if(err) throw err;
        res.redirect("providerList");
        db.close();})
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});


////////////////////////////////////////////////////////////////////////////////////////////////

// 用户管理
router.get("/userList",(req,res)=>{
  var username=req.session.username;
  if(username){ 
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var userList = db.collection("userList");
            async.series([
            function(callback){
              userList.find({},{}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;
                    console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false);
                    }
                })
            },function(callback){
                if(count>0){
                  userList.find({},{}).sort({no1:1}).skip((pageNo-1)*pagenum).limit(pagenum)
                    .toArray((err,result)=>{
                        if(err)throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
                }else{
                    callback(null,[]);
                }
            }],(err,result)=>{
                    if(err)throw err;
                    // console.log(result);
                    res.render("userList",{result:result[1],count,pageNo,totalpage,username})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}
});

//用户账单查询
router.get("/userquery",(req,res)=>{
  var username=req.session.username;
  if(username){
  var name=unescape(req.query.username)||"";
  var number=unescape(req.query.number)||"";
  console.log(username);
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var salelist = db.collection("userList");
            async.series([
            function(callback){
              salelist.find({no2:{$regex:name},no1:{$regex:number}}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;                       
                    console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false)
                    }
                })
            },function(callback){
              if(count>0){
                salelist.find({no2:{$regex:name},no1:{$regex:number}}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum)
                  .toArray((err,result)=>{
                      if(err)throw err;
                      console.log("查询当前页面数据成功");
                      callback(null,result);
                  })
              }else{
                  callback(null,[]);
              }
            }],(err,result)=>{
                    if(err)throw err;
                    res.render("userquery",{result:result[1],count,pageNo,totalpage,username,number,name})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}
});
//添加用户
router.get("/userAdd",(req,res)=>{
  var username=req.session.username;
  if(username){
  res.render("userAdd",{username});
}else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/userAdd2",(req,res)=>{
  var body=req.body;
  console.log(body);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("userList").insert(body,(err,result)=>{
              if(err)throw err;
              res.redirect("userList");
          })
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
 
});
//用户查看
router.get("/userView",(req,res)=>{
  var username=req.session.username;
  if(username){ 
  var id=req.query._id;
  id=ObjectID.createFromHexString(id)
  console.log(id);

  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("userList").findOne({_id:id},{},(err,result)=>{
              if(err)throw err;
              // console.log(result);
              res.render("userView",{result,username});
          })

    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
}else{res.send("<script>window.location.href='/login'</script>")}
});
//用户修改
router.get("/userUpdate",(req,res)=>{
  var username=req.session.username;
  if(username){ 
  var id=req.query._id;
  id=ObjectID.createFromHexString(id)
  console.log(id);

  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("userList").findOne({_id:id},{},(err,result)=>{
              if(err)throw err;
              // console.log(result);
              res.render("userUpdate",{result,username});
          })

    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
}else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/userUpdate2",(req,res)=>{
  var id=req.query._id;
  id=ObjectID.createFromHexString(id);
  var body=req.body;
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      db.collection("userList").update({_id:id},{$set:body},(err,result)=>{
        if(err) throw err;
        res.redirect("userList");
        db.close();})
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});
//用户删除
router.get("/userDelete",(req,res)=>{
  var id=req.query._id;
  id=ObjectID.createFromHexString(id);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{

      db.collection("userList").deleteOne({_id:id},(err,result)=>{
        if(err) throw err;
        res.redirect("userList");
        db.close();})
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////




// 密码修改



router.get("/password",(req,res)=>{
  var username=req.session.username;
  if(username){
  res.render("password",{username});
}else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/regpass",(req,res)=>{
  var oldpass=req.body.oldpassword;
  var newpass=req.body.newpassword;
  var username=req.session.username;
  console.log(username);
  console.log(req.body);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      var user=db.collection("user");
      async.waterfall([
        function(callback){
          user.findOne({username:username},(err,result)=>{
                if(err)throw err;
                var password2=result.password;                       
                console.log(result);
                if(password2==oldpass){
                    callback(null,newpass);
                }else{
                    callback(null,false)
                }
            })
        },function(arg,callback){
          user.update({username:username},{$set:{password:arg}},(err,result)=>{
            if(err) throw err;
            callback(null,result)})
        }],(err,result)=>{
                if(err)throw err;
                res.render("login",{username});
            })

      } catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    })
    
});



/////////////////////////////////////////////////////////////////////////
//员工打卡时间
router.get("/persontime",(req,res)=>{
  var username=req.session.username;
  if(username){
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var userList = db.collection("persontime");
            async.series([
            function(callback){
              userList.find({},{}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;
                    console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false);
                    }
                })
            },function(callback){
                if(count>0){
                  userList.find({},{}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum)
                    .toArray((err,result)=>{
                        if(err)throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
                }else{
                    callback(null,[]);
                }
            }],(err,result)=>{
                    if(err)throw err;
                    // console.log(result);
                    res.render("persontime",{result:result[1],count,pageNo,totalpage,username})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}
});
//员工个人信息
router.get("/personmsg",(req,res)=>{
  var username=req.session.username;
  if(username){
  res.render("personmsg",{username});
}else{res.send("<script>window.location.href='/login'</script>")}
});
//公司活动
router.get("/personact",(req,res)=>{
  var username=req.session.username;
  if(username){
  res.render("personact",{username});
}else{res.send("<script>window.location.href='/login'</script>")}
});
//员工工资信息
router.get("/personpay",(req,res)=>{
  var username=req.session.username;
  if(username){
  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=10;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
            var userList = db.collection("personpay");
            async.series([
            function(callback){
              userList.find({},{}).toArray((err,result)=>{
                    if(err)throw err;
                    count=result.length;
                    console.log(count);
                    if(count>0){
                        totalpage=Math.ceil(count/pagenum);
                        pageNo=pageNo<=1?1:pageNo;
                        pageNo=pageNo>=totalpage?totalpage:pageNo;
                        callback(null,true);
                    }else{
                        callback(null,false);
                    }
                })
            },function(callback){
                if(count>0){
                  userList.find({},{}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum)
                    .toArray((err,result)=>{
                        if(err)throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
                }else{
                    callback(null,[]);
                }
            }],(err,result)=>{
                    if(err)throw err;
                    // console.log(result);
                    res.render("personpay",{result:result[1],count,pageNo,totalpage,username})
                })
    
          } catch(err){
            console.log(err);
            res.send(err);
            db.close()
          }
        })
      }else{res.send("<script>window.location.href='/login'</script>")}
});

//员工密码修改
router.get("/personpwd",(req,res)=>{
  var username=req.session.username;
  if(username){
  res.render("personpwd",{username});
}else{res.send("<script>window.location.href='/login'</script>")}
});
router.post("/regpass2",(req,res)=>{
  var oldpass=req.body.oldpassword;
  var newpass=req.body.newpassword;
  var username=req.session.username;
  console.log(username);
  console.log(req.body);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{
      var user=db.collection("user");
      async.waterfall([
        function(callback){
          user.findOne({username:username},(err,result)=>{
                if(err)throw err;
                var password2=result.password;                       
                console.log(result);
                if(password2==oldpass){
                    callback(null,newpass);
                }else{
                    callback(null,false)
                }
            })
        },function(arg,callback){
          user.update({username:username},{$set:{password:arg}},(err,result)=>{
            if(err) throw err;
            callback(null,result)})
        }],(err,result)=>{
                if(err)throw err;
                res.render("login");
            })

      } catch(err){
        console.log(err);
        res.send(err);
        db.close()
      }
    })
});

router.get("/personadv",(req,res)=>{
  var username=req.session.username;
  if(username){
  res.render("personadv",{username});
}else{res.send("<script>window.location.href='/login'</script>")}
});


router.post("/uploadImg",(req,res)=>{
  console.log("上传图片 ");
  // formData
  var form = new multiparty.Form();

  form.encoding = "UTF-8";
  form.uploadDir = "./uploadtemp";  // 上传文件的临时的存储路径
  form.maxFileSize = 2*1024*1024;    // 2M

  form.parse(req,(err,fields,files)=>{
      if(err) throw err;
      // fields 文件域
      // files 上传图片 

      console.log(fields)
      console.log(files)
      var uploadUrl =  "/images/upload/"  // 文件的真实目录 
      file = files["filedata"];
      originalFilename = file[0].originalFilename;  // 文件名  4.jpg 
      tempath = file[0].path;  // 文件的临时路径

      var timestamp = new Date().getTime(); // 当前时间戳
      uploadUrl +=timestamp+originalFilename;  // /images/upload/1234567894.jpg 
      newPath = "./public" + uploadUrl

      // 通过文件流进行文件读和写 
      var fileReadStream = fs.createReadStream(tempath);
      var fileWriteStream = fs.createWriteStream(newPath);

      fileReadStream.pipe(fileWriteStream);  // 通过 pipe 管道 输送文件

      // 监听文件上传  关闭 
      fileWriteStream.on("close",()=>{
          // 删除临时文件 
          fs.unlinkSync(tempath);
          res.send('{"err":"","msg":"'+uploadUrl+'"}');
      })
  })

})


//发送我的建议
router.post("/advise",(req,res)=>{
  var username=req.session.username;
  var body = req.body;
  if(username){
      MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
          db.collection("comments").insert( {title:body.title,content:body.content,time:new Date()},(err,result)=>{
          if(err) throw err;
                  res.render("personadv",{username});
              })                 

          }catch(err){
              res.send(err);
              db.close();
          }
      })

  }else{
      res.send("<script>window.location.href='/login'</script>")
  }
  
});


//获取员工意见

router.get("/opinionList",(req,res)=>{
  var username  = req.session.username;
  if(username){

  var count=0;//总条数
  var totalpage=0;//总页数
  var pagenum=4;//每页显示的页数
  var pageNo=parseInt(req.query.pageNo)||0;//显示第几页


      MongoClient.connect(CONN_BD_STR,(err,db)=>{
          try{
              var comments = db.collection("comments");
              async.series([
              function(callback){
                  comments.find({},{}).toArray((err,result)=>{
                      if(err)throw err;
                      count=result.length;
                      console.log(count);
                      if(count>0){
                          totalpage=Math.ceil(count/pagenum);
                          pageNo=pageNo<=1?1:pageNo;
                          pageNo=pageNo>=totalpage?totalpage:pageNo;
                          callback(null,true);
                      }else{
                          callback(null,false)
                      }
                  })
              },function(callback){
                  if(count>0){
                      comments.find({},{}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum).toArray((err,result)=>{
                          if(err)throw err;
                          // console.log("查询当前页面数据成功");
                          callback(null,result);
                      })
                  }else{
                      callback(null,[]);
                  }
              }],(err,result)=>{
                      if(err)throw err;
                      var value = result[1].map((item,index)=>{
                          item.time = setDate(item.time);
                          return item;
                      });
                      req.session.username=username;
                      res.render("opinionList",{result:value,count,pageNo,totalpage,username})
                  })               
          }catch(err){
              res.send(err);
              db.close();
          }
      })
     
  }else{  res.send("<script>alert('session已经过期,请重新登录!');window.location.href='/login'</script>")  }
})

//删除员工意见
router.get("/opinionDelete",(req,res)=>{
  var id=req.query._id;
  id=ObjectID.createFromHexString(id);
  MongoClient.connect(CONN_BD_STR,(err,db)=>{
    try{

      db.collection("comments").deleteOne({_id:id},(err,result)=>{
        if(err) throw err;
        res.redirect("opinionList");
        db.close();})
    }catch(err){
      console.log(err);
      res.send(err);
      db.close()
    }
  })
});

module.exports = router;


