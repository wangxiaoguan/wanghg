

var express = require("express");
var router = express.Router();
var {MongoClient} = require("mongodb");
var CONN_BD_STR = "mongodb://localhost:27017/wh1803"
var ObjectID = require("mongodb").ObjectID;
var async = require("async");

function setDate(date){
    var time = new Date(date);
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var day = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`
}

router.get("/",(req,res)=>{
    res.send("这是一个电影评论模块的router")
});

// router.get("/may",(req,res)=>{
//     res.send("daydayup");
// })
router.get("/index",(req,res)=>{
    var username  = req.session.username;
    var mid = req.query.mid;
    if(username){
        MongoClient.connect(CONN_BD_STR,(err,db)=>{
            try{
                db.collection("movie").findOne({id:mid},{},(err,result)=>{
                    if(err) throw err;
                    res.render("comment",{result});
                })

            }catch(err){
                res.send(err);
                db.close();
            }
        })
    }else{
        res.send("<script>alert('session已经过期,请重新登录!');window.location.href='/login'</script>")
    }

    // res.render("comment");
    // res.send("进入评论页面")
});


// 提交评论
router.post("/submit",(req,res)=>{
    var username = req.session.username;
    var body = req.body;
    var mid = req.query.mid; 

    if(username){
        MongoClient.connect(CONN_BD_STR,(err,db)=>{
            try{
                var comments = db.collection("comments");
                var ids = db.collection("ids");
                // 事件1 取到自增长的 id  
                // 事件2 得到 id 当着主键存入 comments 
                async.waterfall([
                    function(callback){
                        ids.findAndModify(
                            {name:"comments"},  // query
                            [["_id","desc"]],  // sort 排序
                            {$inc:{id:1}},  // id+ 1 
                            function(err,result){
                                if(err) throw err;
                                console.log(result);
                                callback(null,result.value.id)
                            }
                        )
                    },
                    function(uid,callback){
                        db.collection("movie").findOne({id:mid},(err,result)=>{
                            if(err) throw err;
                            console.log(result);
                            callback(null,uid,result.title)
                        })
                    },
                    function(uid,mTitle,callback){
                        var data = {mid,mTitle,uid,username,title:body.title,content:body.content,time:new Date()}
                        comments.insert(data,(err,result)=>{
                            if(err) throw err;
                            callback(null,result)
                        })
                    }

                ],(err,result)=>{
                    if(err) throw err;
                    console.log(result);
                    // res.send("评论提交成功");
                    // res.render("")
                    res.redirect("/comments/list?mid="+mid)
                })    
            }catch(err){
                res.send(err);
                db.close();
            }
        })
    }else{
        res.send("<script>alert('session已经过期,请重新登录!');window.location.href='/login'</script>")
    }
})

router.get("/list",(req,res)=>{
    var username = req.session.username;
    var mid = req.query.mid;
    var movie = !!req.query.movie*1 || false;
    var my = !!req.query.my*1 || false;  
    var obj = {};
    if(movie){
        obj.mid = mid;
    }
    if(my){
        obj.username = username
    }

    if(username){
        var count = 0;   // 总条数
        var totalPage = 0;  // 总 页数
        var pageSize = 10;  // 每页显示的条数
        var pageNo = parseInt(req.query.pageNo) ||  0  // 当前的页面

        var findData = function(db,callback){
            var comments = db.collection("comments");
            // comments.find({},{}).toArray((err,result)=>{
            //     if(err) throw err;
            //     callback(result);
            // })

            // 分页查询
            async.series([
                // 1. 查询页数 和 总条数  
                function(callback){
                    comments.find(obj,{}).toArray((err,result)=>{
                        if(err) throw err;
                        count = result.length;
                        if(count>0){
                            totalPage = Math.ceil( count/pageSize);
                            pageNo = pageNo<=1?1:pageNo;
                            pageNo = pageNo>=totalPage?totalPage:pageNo;
                            callback(null,true);
                        }else{
                            callback(null,false);
                        }
                    })
                },
                function(callback){
                    if(count>0){
                        comments.find(obj,{}).sort({_id:-1}).skip((pageNo-1)*pageSize).limit(pageSize).toArray((err,result)=>{
                            if(err) throw err;
                            console.log("查询当前页面数据成功");
                           
                            callback(null,result);
                        })
                    }else{
                        callback(null,[]);
                    }
                   
                }
            ],(err,result)=>{
                if(err) throw err;
                callback(result)
            })
        }

        MongoClient.connect(CONN_BD_STR,(err,db)=>{
            try{
                findData(db,(result)=>{
                    console.log(result);
                    var value = result[1].map((item,index)=>{
                        item.time = setDate(item.time);
                        return item;
                    })
                    res.render("mlist",{
                        result:value,
                        pageNo,
                        count,
                        totalPage,
                        mid
                    });
                })
            }catch(err){
                res.send(err);
                db.close()
            }
        })
    }else{
        res.send("<script>alert('session已经过期,请重新登录!');window.location.href='/login'</script>")
    }   
    
})

router.get("/detail",(req,res)=>{

    var uid = req.query.uid*1;
    var username = req.session.username;
    MongoClient.connect(CONN_BD_STR,(err,db)=>{
        try{
            async.waterfall([
                function(callback){
                    db.collection("comments").findOne({uid},{},(err,result)=>{
                        if(err) throw err;
                        callback(null,result);
                    })
                },
                function(comment,callback){
                    db.collection("movie").findOne({id:comment.mid},{},(err,result)=>{
                        if(err) throw err;
                        callback(null,[comment,result]);
                    })
                }
            ],(err,result)=>{
                if(err) throw err;
                console.log(result)
                // res.send("评论详情");
                res.render("detail",{
                    comment:result[0],
                    result:result[1]
                })
                db.close();
            })


        }catch(err){
            res.send(err);
            db.close()
        }
    })
})


router.get("/mv/detail",(req,res)=>{
    var mid = req.query.mid;
    var username = req.session.username;
    MongoClient.connect(CONN_BD_STR,(err,db)=>{
        try{
            async.waterfall([
                function(callback){
                    // 查询当前电影 
                    db.collection("movie").findOne({id:mid},{},(err,result)=>{
                        if(err) throw err;
                        callback(null,result);
                    })
                },
                function(movie,callback){
                    db.collection("comments").find({mid},{}).toArray((err,result)=>{
                        if(err) throw err;
                        callback(null,[movie,result]);
                    })
                }
            ],(err,result)=>{
                if(err) throw err;
                console.log(result);
                // res.send("查看电影的所有评论");
                res.render("mv-detail",{
                    result:result[0],
                    comments:result[1]
                })

                db.close();


            })
        }catch(err){
            res.send(err);
            db.close()
        }
    })
})

router.get("/delete",(req,res)=>{
    var mid = req.query.mid ;
    var username = req.session.username;
    var _id = req.query._id;
    var obj = {}
    if(_id!=='-1'){
        obj = {_id:ObjectID.createFromHexString(_id)}
    }

    MongoClient.connect(CONN_BD_STR,(err,db)=>{
        try{
            db.collection("comments").remove(obj,(err,result)=>{
                if(err) throw err;
                res.redirect("/comments/list?mid="+mid);
                db.close();
            })
        }catch(err){
            res.send(err);
            db.close();
        }
    })



})

module.exports = router;
