const path = require('path')
const fs = require('fs')
// const chatTXT = path.join(__dirname, 'demo/javascript/src/chatTXT.txt')
const chatfile = path.join(__dirname, 'demo/chatfile') //聊天文件夹
window.readfile=function(){//读取chatfile文件夹里面的目录
    fs.readdir(chatfile, function(err, files) {
        if (err) throw err;
        console.log(files);// files是一个数组，每个元素是此目录下的文件或文件夹的名称
        if(files.length==0){//第一次登陆
            window.mkdirfile()
        }else{
            if(files.length==1){
                if(files[0].indexOf(window.userId)==-1){
                    window.mkdirfile()
                }else{
                    window.readFile()
                }
            }else{
                let users = files.join('-')
                if(users.indexOf(window.userId)==-1){
                    window.mkdirfile()
                }else{
                    window.readFile()
                }
            }
        }
        window.users = files.length
    });
}
window.mkdirfile=function(){//创建文件
    fs.writeFile(chatfile + "/"+window.userId+".txt", "", function(err) {
        if(err) throw err;
        window.chatTXT = {}
    });
}
window.readFile=function(){//读写chatTXT
    
    let chatPath = path.join(__dirname, `demo/chatfile/${window.userId}.txt`)
    window.chatPath = chatPath
    fs.readFile(chatPath,function (err,data) {
        if(err){
            return console.log(err);
        }else {
            let result=data.toString()
            window.chatTXT=result?JSON.parse(result):{}
        }
    })

}
window.appendFile=function(){//写入信息，追加原来的信息
    let obj = window.appendTXT
    fs.appendFile(window.chatPath,obj,(err)=>{
        if(err) throw err;
        console.log('写入成功')
        
    })
}
window.writeFile=function(){//写入信息，覆盖原来的信息
    let obj = window.writeTXT
    fs.writeFile(window.chatPath,obj,(err)=>{
        if(err) throw err;
        console.log('写入成功')
        
    })
}