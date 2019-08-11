

var express = require("express");
var router = express.Router();
var {MongoClient} = require("mongodb");
var CONN_BD_STR = "mongodb://localhost:27017/wh1803"

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
                        var data = {mid,uid,username,title:body.title,content:body.content,time:new Date()}
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
    var mid = req.session.mid;

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
                    comments.find({},{}).toArray((err,result)=>{
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
                    comments.find({},{}).sort({_id:-1}).skip((pageNo-1)*pageSize).limit(pageSize).toArray((err,result)=>{
                        if(err) throw err;
                        console.log("查询当前页面数据成功");
                        callback(null,result);
                    })
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


module.exports = router;
