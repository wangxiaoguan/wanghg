

// node 命名规范  驼峰命名 
// 创建文件并写入内容：writeFile,appendFile

// writeFile 创建
// appendFile 添加文件内容

var fs = require('fs');

fs.writeFile("./logs/hello.log","hello node111 ~ \n","utf-8",(err)=>{
    if(err) throw err;
    console.log("创建文件成功");
})  


fs.appendFile("logs/hello.txt","hello 武汉1803  good \n",err=>{
    if(err) throw err;
    console.log('数据写入成功')
});

for(var i=0;i<100;i++){
    fs.appendFile("logs/hello.txt",`hello 武汉1803  good ---- ${i} \n`,err=>{
        if(err) throw err;
        console.log('数据写入成功')
    });
}

