

// node 连接 mysql  

var mysql = require('mysql');

console.log(mysql);


var conn = mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:'root',
    database:"wh1803"
});


conn.connect((err)=>{
    if(err) throw err;
    console.log("连接数据库成功")
});

var insertSql = "insert into person (username,phone,sex) values (?,?,?)";  
var insertParams = ['huahua',"13812341234","female"];

conn.query(insertSql,insertParams,(err,result)=>{
    if(err) throw err;
    console.log(result);  
});

var updateSql = "update person set  phone = ? where username = ?"
var updateParams = ["15812341234",'ming'];
conn.query(updateSql,updateParams,(err,result)=>{
    if(err) throw err;
    console.log(result);  
})

conn.query("delete from person where username = ?","huahua",(err,result)=>{
    if(err) throw err;
    console.log(result);  
})

conn.query("select * from person where id >  ? ",3,(err,result)=>{
    if(err) throw err;
    console.log(result);    
})




conn.end(()=>{
    console.log("close 数据库连接")
})