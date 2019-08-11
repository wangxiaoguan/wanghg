
var {readHtmlFile,readServerHtml,readImg,readPostHtml} = require("../js/file");

var url = require("url");
var querystring = require("querystring");

var {MongoClient} = require("mongodb");

var CONN_DB_STR = "mongodb://localhost:27017/wh1803";


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