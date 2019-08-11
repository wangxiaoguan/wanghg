

// 列出目录的东西：readdir

var fs = require("fs");

fs.readdir("../day1","utf-8",(err,files)=>{
    if(err) throw err;
    console.log(files);

    // item 数组活跃的数据
    // index 下标
    // list 当前数组  

    // forEach map filter find reduce some every 
    files.forEach(function(item,index,list){
        console.log(`${item}---${index}`)
    })
})