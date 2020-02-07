

var express = require("express");
var router = express.Router();
var {MongoClient} = require("mongodb");
// var CONN_BD_STR = "mongodb://localhost:27017/manage";
var CONN_BD_STR = "mongodb://60.205.201.113:27017/manage"
var ObjectID = require("mongodb").ObjectID;
var async = require("async");
var multiparty = require("multiparty");
var fs =require("fs");


router.get('/',(req,res)=>{
    res.send("这是一个电影评论模块的router");
});

function setDate(date){
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    var day=date.getDate();
    var hour=date.getHours();
    var min=date.getMinutes();
    var sec=date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

router.get("/index",(req,res)=>{
    // res.send("进入电影评价页面")
    var username  = req.session.username;
    req.session.username  = username;

    var mid = req.query.mid;
    if(username){
        MongoClient.connect(CONN_BD_STR,(err,db)=>{
            try{
                db.collection("movie").findOne({id:mid},{},(err,result)=>{
                    if(err) throw err;
                    res.render("comment",{result});
                    // res.redirect("comment",{result});
                })

            }catch(err){
                res.send(err);
                db.close();
            }
        })
    }else{
        res.send("<script>alert('session已经过期,请重新登录!');window.location.href='/login'</script>")
    }

});

router.post("/submit",(req,res)=>{
    var username=req.session.username;
    var body = req.body;
    var mid = req.query.mid; 
    // if(username){
        MongoClient.connect(CONN_BD_STR,(err,db)=>{
            try{
                var comments = db.collection("comments");
                var ids = db.collection("ids");
                async.waterfall([
                    function(callback){
                        ids.findAndModify(
                            {name:"comments"},  // query
                            {_id:-1},  // sort 排序
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
                            if(err)throw err;
                            console.log(uid);
                            callback(null,uid,result.title);
                        })
                    },
                    function(uid,mtitle,callback){
                        var data = {mid,mtitle,uid,username,title:body.title,content:body.content,time:new Date()};
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

    // }else{
    //     res.send("<script>alert('session已经过期,请重新登录!');window.location.href='/login'</script>")
    // }
    
});

router.get("/list",(req,res)=>{
    var username  = req.session.username;
    console.log("从工厂工程工程工程");   
    console.log(username);
    var mid = req.query.mid; 
    var movie = !!req.query.movie*1 || false;
    var my = !!req.query.my|| false;  
    var obj = {};
    if(movie){ obj.mid = mid; }
    if(my){obj.username = username;}
    console.log(obj);
    var count=0;//总条数
    var totalpage=0;//总页数
    var pagenum=10;//每页显示的页数
    var pageNo=parseInt(req.query.pageNo)||0;//显示第几页
 
    // if(username){
        MongoClient.connect(CONN_BD_STR,(err,db)=>{
            try{
                var comments = db.collection("comments");
                console.log("连接数据库成功");
                async.series([
                function(callback){
                    comments.find(obj,{}).toArray((err,result)=>{
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
                        comments.find(obj,{}).sort({_id:-1}).skip((pageNo-1)*pagenum).limit(pagenum).toArray((err,result)=>{
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
                        res.render("clist",{result:value,mid,count,pageNo,totalpage,username})
                    })               
            }catch(err){
                res.send(err);
                db.close();
            }
        })
       
    // }else{
    //     res.send("<script>alert('session已经过期,请重新登录!');window.location.href='/login'</script>")
    // }
      
});

router.get("/detail",(req,res)=>{
    var uid2 = req.query.uid*1; 
    console.log(uid2)
    var username  = req.session.username;
    // if(username){
        MongoClient.connect(CONN_BD_STR,(err,db)=>{
            try{
                var comments=db.collection("comments");
                async.waterfall([
                    function(callback){
                         comments.findOne({uid:uid2},{},(err,result)=>{
                            if(err) throw err;
                            console.log(result);
                            callback(null,result);
                            
                        })
                    },
                    function(comment,callback){
                        db.collection("movie").findOne({id:(comment.mid)},{},(err,result)=>{
                            if(err) throw err;
                            callback(null,[comment,result]);
                        })
                    }
                ],(err,result)=>{
                    if(err) throw err;
                    console.log(result)
                    // res.send("评论详情");
                    res.render("detail",{comment:result[0],result:result[1]})
                    db.close();
                })
            }catch(err){
                res.send(err);
                db.close()
            }
        })
})

router.get("/mv/detail",(req,res)=>{
    var mid2 = req.query.mid; 
    var username  = req.session.username;
    // if(username){
        MongoClient.connect(CONN_BD_STR,(err,db)=>{
            try{
                var comments=db.collection("comments");
                var movie=db.collection("movie");
                async.waterfall([
                    function(callback){
                        movie.findOne({id:mid2},{},(err,result)=>{
                            if(err) throw err;
                            callback(null,result);
                        })
                    },
                    function(movie,callback){
                            comments.find({mid:mid2},{}).toArray((err,result)=>{
                            if(err) throw err;
                            callback(null,[movie,result]);                        
                        })
                    }                    
                ],(err,result)=>{
                    if(err) throw err;
                    res.render("mvdetail",{movie:result[0],comments:result[1]})
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
    console.log(req.query);
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

router.get("/revise",(req,res)=>{
    var mid = req.query.mid ;
    var uid = req.query.uid*1;
    var title2 =unescape(req.query.title);
    var content2 = unescape(req.query.content );
    var username = req.session.username;
    // var _id = req.query._id;
    // var obj = {};
    // if(_id!=='-1'){  obj = {_id:ObjectID.createFromHexString(_id)}   }
    MongoClient.connect(CONN_BD_STR,(err,db)=>{
        try{
            db.collection("comments").update({uid:uid},{$set:{title:title2,content:content2}},(err,result)=>{
                if(err) throw err;
                res.redirect("/comments/list?mid="+mid);
                db.close();})
        }catch(err){
            res.send(err);
            db.close();
        }
    })
}) 

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





module.exports=router;

