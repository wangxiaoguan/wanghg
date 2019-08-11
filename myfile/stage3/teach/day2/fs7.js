

// 删除目录与文件：rmdir,unlink

// rmdir 删除文件夹
// unlink  删除文件  

var  fs = require("fs");

// 读取 logs 下所有的文件信息
var files = fs.readdirSync("logs");

console.log(files)

files.forEach((value,index)=>{
    fs.unlink(`logs/${value}`,err=>{
        if(err) throw err;
        console.log(`删除文件成功----${index}-------${item}`);
    })
})

// 删除文件夹
fs.rmdir('logs',(err)=>{
    if(err) throw err;
    console.log("delete directory success")
})