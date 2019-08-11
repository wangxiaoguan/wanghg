

var express = require("express");
var router = express.Router();
var {MongoClient} = require("mongodb");
var CONN_BD_STR = "mongodb://localhost:27017/wh1803"

var async = require("async");

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
    res.render("mlist");
})


module.exports = router;
