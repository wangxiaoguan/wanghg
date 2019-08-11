

//  nodeJs 连接 mongodb 数据库


var mongodb = require("mongodb");

// console.log(mongodb);


var MongoClient = mongodb.MongoClient; 
// var {MongoClient} = require("mongodb") 
var CONN_DB_STR = "mongodb://localhost:27017/wh1803";

function senddata(callback){
    
}
// MongoClient.connect(CONN_DB_STR,(err,db)=>{
//     try{
//         console.log("数据库连接成功success");

//         // 操作 user 集合
//         var user = db.collection("user");
//         var movie = db.collection("movie");

//         movie.find({},{year:1,title:1,genres:1,_id:0}).toArray((err,result)=>{
//             if(err) throw err;
//             console.log(result);
//         })

//         var data = {username:"chinese",password:"1949"}
//         user.insert(data,function(err,result){
//             if(err) throw err;
//             console.log(result);
            
//         });


//         user.remove({age:12},(err,result)=>{
//             if(err) throw err;
//             console.log(result);
//             db.close();
//         })

//     }catch(err){
//         console.log("数据库错误");
//     }
// })




const http = require("http");
http.createServer((req,res)=>{

    if(req.url!=="/favicon.ico"){
        res.writeHead(200,{'Content-Type':"text/plain;charset=utf-8"});
        MongoClient.connect(CONN_DB_STR,(err,db)=>{
            try{
                console.log("数据库连接成功success");
        
                // 操作 user 集合
                var user = db.collection("user");
                var movie = db.collection("movie");
        
                movie.find({},{year:1,title:1,genres:1,_id:0}).toArray((err,result)=>{
                    if(err) throw err;
                    console.log(result);
                    res.write(JSON.stringify(result));
                    res.end();
                })
        
            }catch(err){
                console.log("数据库错误");
            }
        })
        
    }
}).listen(3000,'localhost',()=>{
    console.log('server is running at http://localhost:3000');
})