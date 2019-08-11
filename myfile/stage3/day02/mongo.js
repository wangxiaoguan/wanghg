

var mongodb=require("mongodb");
var mongoclient=mongodb.MongoClient;
var table="mongodb://localhost:27017/user";
mongoclient.connect(table,(err,db)=>{
    try{
         db.collection("movie").find({},{}).toArray((err,result)=>{
            if(err)throw err;
            res.send(result);
        })       
    }catch(err){
        if(err)throw err;
    }
})