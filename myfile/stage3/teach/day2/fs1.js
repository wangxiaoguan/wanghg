


//  fs 文件系统   node 模块

// stat 查看文件信息

// stat
// statSync 



// sync 同步
// Async 异步  callback

// 得到文件与目录的信息：stat

var fs = require("fs");

fs.stat("./events.js",function(err,stats){
    if(err){
        console.error(err)
    }else{
        console.log(stats);
        console.log(`文件 : ${stats.isFile()}`)
        console.log(` ${stats.isDirectory()?'这是文件夹':'这是一个文件'}`)
    }
})

fs.stat("../day1",(err,stats)=>{
    if(err) throw err;
    console.log(`${stats.isDirectory()}`)
    console.log(` ${stats.isDirectory()?'这是文件夹目录':'这是一个文件'}`)
})