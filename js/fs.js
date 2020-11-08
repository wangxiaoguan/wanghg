var fs=require("fs");
// readFile 读取文件内容
fs.readFile("app.txt","utf-8",(err,data)=>{
    if(err)throw err;
    console.log(data);
});
// writeFile 写入数据（覆盖）
fs.writeFile("app.txt","天道酬勤","utf-8",err=>{
    if(err)throw err;
    console.log("写入数据成功");
});
// appendFile 写入数据（追加）
fs.appendFile("app.txt","天道酬勤","utf-8",err=>{
    if(err) throw err;
    console.log("写入数据成功");
});
// mkdir 创建文件夹
fs.mkdir("app",err=>{
    if(err) throw err;
    console.log("文件夹创建成功");
})
// stat 查看文件信息
fs.stat("app",(err,msg)=>{
    if(err) throw err;
    console.log(`${msg.isFile()?"这是文件":"这是文件夹"}`);
    console.log(`${msg.isDirectory()?"这是文件夹":"这是文件"}`);
})
// readdir 列出目录的东西
fs.readdir("app",(err,data)=>{
    if(err) throw err;
    console.log(data); 
})
// rename  重命名目录或文件
fs.rename("app.txt","home.txt",err=>{
    if(err) throw err;
    console.log("文件改名成功");
})
// unlink  删除文件
fs.unlink('app.txt',err=>{
    if(err) throw err;
    console.log("删除文件成功");
})
// rmdir 删除文件夹
fs.rmdir("app",err=>{
    if(err) throw err;
    console.log("删除文件夹成功");
})



var stat=fs.stat;
var copy=function(src,dst){
    //读取目录
    fs.readdir(src,function(err,paths){
        console.log(paths)
        if(err){
            throw err;
        }
        paths.forEach(function(path){
            var _src=src+'/'+path;
            var _dst=dst+'/'+path;
            var readable;
            var writable;
            stat(_src,function(err,st){
                if(err){
                    throw err;
                }
                
                if(st.isFile()){
                    readable=fs.createReadStream(_src);//创建读取流
                    writable=fs.createWriteStream(_dst);//创建写入流
                    readable.pipe(writable);
                }else if(st.isDirectory()){
                    exists(_src,_dst,copy);
                }
            });
        });
    });
}

var exists=function(src,dst,callback){
    //测试某个路径下文件是否存在
    fs.exists(dst,function(exists){
        if(exists){//不存在
            callback(src,dst);
        }else{//存在
            fs.mkdir(dst,function(){//创建目录
                callback(src,dst)
            })
        }
    })
}

exists('app','home',copy)
