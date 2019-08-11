

// 重命名目录或文件：rename 

var fs = require("fs");

fs.rename("logs/demo.log","logs/demodemo.log",(e)=>{
    if(e) throw e;
    console.log("文件重命名成功")
})