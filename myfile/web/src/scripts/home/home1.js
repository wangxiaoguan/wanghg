
import React,{Component} from "react";
import './home.scss'
export default class Home1 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home1'> 
<pre>{`
var fs=require("fs");

fs.readFile("app.txt","utf-8",(err,data)=>{         // readFile 读取文件内容
    if(err)throw err;
    console.log(data);
})

fs.writeFile("app.txt","天道酬勤","utf-8",err=>{    // writeFile 写入数据（覆盖）
    if(err)throw err;
    console.log("写入数据成功");
})

fs.appendFile("app.txt","天道酬勤","utf-8",err=>{   // appendFile 写入数据（追加）
    if(err) throw err;
    console.log("写入数据成功");
})

fs.mkdir("app",err=>{                               // mkdir 创建文件夹
    if(err) throw err;
    console.log("文件夹创建成功");
})

fs.stat("app",(err,msg)=>{                          // stat 查看文件信息
    if(err) throw err;
    console.log(msg);
})

fs.readdir("app",(err,data)=>{                      // readdir 列出目录的东西
    if(err) throw err;
    console.log(data); 
})

fs.rename("app.txt","home.txt",err=>{               // rename  重命名目录或文件
    if(err) throw err;
    console.log("文件改名成功");
})

fs.unlink('app.txt',err=>{                          // unlink  删除文件
    if(err) throw err;
    console.log("删除文件成功");
})

fs.rmdir("app",err=>{                               // rmdir 删除文件夹
    if(err) throw err;
    console.log("删除文件夹成功");
})
`}</pre>
<pre>{`
var fs=require('fs');
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
`}</pre>

            </div>
    
        )
    }
}


