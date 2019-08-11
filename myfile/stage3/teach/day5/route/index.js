
var {readHtmlFile,readServerHtml,readImg,readPostHtml} = require("../js/file");

var url = require("url");
var querystring = require("querystring");

var {MongoClient} = require("mongodb");

var CONN_DB_STR = "mongodb://localhost:27017/wh1803";

var async = require("async");

module.exports = {
    home(req,res){
        readHtmlFile("./views/home.html",req,res);   // 相对于 server2.js 同级目录 
    },
    login(req,res){
        // readHtmlFile("./views/login.html",req,res);  

        // 获取路由参数  
        console.log(req.url);

        // 1. get  方式  
      
        // var query = url.parse(req.url,true).query;
        // console.log(query);

        // post 方式请求数据  
        var params = "";
        // 监听post 提交的请求的数据 传输 
        req.on("data",data=>{
            params+=data;
        })

        
        req.on("end",()=>{
            console.log(params);
            params = querystring.parse(params);
            console.log(params);
            var username = params['username'];
            var password = params["password"];
            // readPostHtml("./views/login.html",req,res,params);
            if(username&&password){
                MongoClient.connect(CONN_DB_STR,(err,db)=>{
                    try{
                        console.log("连接数据库成功");
                        db.collection("user").find({username:username,password},{}).toArray((err,result)=>{
                            if(err) throw err;
                            console.log(result.length);
                            if(result.length>0){
                                console.log("登录成功");
                            }else{
                                console.log("登录失败");
                            }
                            readHtmlFile("./views/login.html",req,res); 
                            db.close();
                        })
                    }catch(err){
                        console.log(err);
                    }
                })

            }else{
                readHtmlFile("./views/login.html",req,res);  
            }
            
        });





        req.on("error",(err)=>{
            console.error(err)
        })
       
    },
    register(req,res){

        var postData = "";
        req.on("data",(data)=>{
            postData+=data;
        })
        req.on("end",()=>{
            console.log(postData);
            postData = querystring.parse(postData);
            var username = postData.username;
            var password = postData.password;
            if(username&&password){
                MongoClient.connect(CONN_DB_STR,(err,db)=>{
                    try{
                        console.log("database success");
                        var user = db.collection("user");
                        // 注册 先判断是否已经注册 
                        
                        // 如果没有注册就直接插入新增 
                        async.waterfall([
                            function(callback){
                                user.find({username},{}).toArray((err,result)=>{
                                    if(err) throw err;
                                    if(result.length>0){
                                        // 已经注册过
                                        callback(null,true);
                                    }else{
                                        // 没有注册
                                        callback(null,false);
                                    }
                                })
                            },
                            function(arg,callback){
                                if(!arg){
                                    // 进行新增
                                    user.insert(postData,(err,result)=>{
                                        if(err) throw err;
                                        callback(null,"注册成功")
                                    })
                                }else{
                                    callback(null,"注册失败--用户名已经存在")
                                }
                            }
                        ],(err,result)=>{
                            if(err) throw err;
                            console.log(result)
                        })
                    }catch(err){
                        console.log(err);
                    }
                })
            }
        })
        readHtmlFile("./views/register.html",req,res);  
    },
    img(req,res){
        readImg("./img/img2.png",req,res);
    },
    yangyang(req,res){
        readImg("./img/2.jpg",req,res);
    }
    
}





















// module.exports = {
//     home(req,res){
//         res.write("<h1>home -home -home 我的小窝 </h1>")
//         res.end();
//     },
//     login(req,res){
//         res.write("<h1> login 马上登录 </h1>");
//         res.end();
//     },
//     register(req,res){
//         res.write("<h1>register 马上前往注册  </h1>");
//         res.end();
//     },
// }