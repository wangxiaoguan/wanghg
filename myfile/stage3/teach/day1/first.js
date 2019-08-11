
console.log("第一个node 编写的 web 服务器");

var http = require("http");     // http node模块

var hostname = "localhost";  // 127.0.0.1    主机IP

var port = 3000;             // 服务器端口  

// callback  
// request 请求    客户端向服务端发送的请求   带有请求url / 参数params 
// response 响应   服务器向客户端响应数据    data/json 
var server = http.createServer(function(request,response){
    console.log("my node server ");
    response.setHeader("Content-type","text/html;charset=utf-8");   // 设置请求头
    response.write("<h2>这是我第一个node服务器</h2>");
    response.end("<h2>好好学习天天向上</h2>");
});

// 监听服务
server.listen(port,hostname,function(){
    console.log(`this server is running at http://${hostname}:${port}`);
})



