

// 读取 大文件  
// 通过文件流  stream 流

// createReadStream 创建可读流对象
// createWriteStream  创建可写流对象 


var fs = require("fs");
var readFileStream = fs.createReadStream("data.json",{encoding:"utf-8"});
var writeFileStream = fs.createWriteStream("data-1.json",{encoding:"utf-8"});

var zlib = require("zlib");  //压缩  



// 读写 1 
// 通过监听 pipe  事件  管道 输送   
// 链式使用 pipe


var count = 0;

writeFileStream.on("pipe",(source)=>{
    count++;
    console.log(source)
});

readFileStream
    .pipe(zlib.createGzip())   // 压缩文件
    .pipe(writeFileStream);  // 执行流    pipe

console.log(count);


// 方式 2 
// on 监听事件
// once 监听一次 
// readFileStream.once("data",(data)=>{
//     console.log(data);
// })

// var count =0;
// readFileStream.on("data",(data)=>{
//     count++;
//     console.log(`count===${count}`)
//     writeFileStream.write(data);
// });

// readFileStream.on("error",err=>{
//     console.error(err);
// });

// readFileStream.on("end",()=>{
//     console.log("文件流读入结束===="+count)
// })
