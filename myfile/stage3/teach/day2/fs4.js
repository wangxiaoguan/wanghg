

// 读取文件的内容：readFile

var fs = require("fs");

fs.readFile("logs/hello.txt",'utf-8',(err,data)=>{
    if(err) throw err;
    console.log(data);
});

fs.readFile("lagou.html",'utf-8',(err,result)=>{
    if(err) throw err;
    console.log(result);
})


// 同步读取 
// readFileSync

const fileData = fs.readFileSync("logs/hello.log",'utf-8');
console.log(fileData);