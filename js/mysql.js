

var mysql=require("mysql");
var content=mysql.createConnection({
    host:"localhost",
    post:3306,
    user:"root",
    password:"root",
    database:"1803"
});
content.connect((err)=>{
    if(err)throw err;
    console.log("连接数据库成功")
})