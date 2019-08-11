

var fs = require("fs");


exports.readHtmlFile = function(file,req,res){
    fs.readFile(file,'utf-8',(err,data)=>{
        if(err) throw err;
        // console.log(data);
        res.writeHead(200,{'Content-Type':"text/html;charset=utf-8"});
        res.write(data);
        res.end();
    })
}

exports.readServerHtml = function(path,req,res){
    fs.readFile(path,'utf-8',(err,data)=>{
        if(err) throw err;
        // console.log(data);
        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        res.write(data);
        res.end();
    })
}


exports.readImg = function(path,req,res){
    fs.readFile(path,'binary',(err,data)=>{  //binary 二进制
        if(err) throw err;
        res.writeHead(200,{"Content-Type":"image/jpeg"});
        res.write(data,'binary');
        res.end();
    })   
}

exports.readPostHtml = function(path,req,res,postData){
    var array = ['username','password'];
    var username = postData['username'];
    var password = postData.password;
    fs.readFile(path,"utf-8",(err,data)=>{
        if(err) throw err;
        console.log(data);
        // 正则 
        // /^[a-zA-Z0-9]{6,12}$/
        // /^1(3|5|7|8|9)\d{9}$/
        // new RegExp("^1(3|5|7|8|9)\d{9}$gi")   绑定变量
        // g golbal 全局匹配
        // i ignore 忽视大小写
        array.forEach((item,index)=>{
            var reg = new RegExp("{{"+item+"}}",'gi');     // {username}
            data = data.replace(reg,postData[item])
        }); 
        if(username&&password){
            // 登录成功
            data = data.replace(/{{userInfo}}/gi,"");
            data = data.replace(/{{formInfo}}/gi,"hide");
        }else{
            // 登录失败 未登录
            data = data.replace(/{{userInfo}}/gi,"hide");
            data = data.replace(/{{formInfo}}/gi,"");
        }
        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        res.write(data);
        res.end();
    })
}
