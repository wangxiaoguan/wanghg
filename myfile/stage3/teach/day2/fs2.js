


// mkdir 创建文件夹 
// fs.mkdir(path[, mode], callback)

var fs = require("fs");

fs.mkdir("logs",(err)=>{
    if(err) throw err;
    console.log("文件夹dir创建成功")
})