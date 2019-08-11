

const  http = require("http");  // node 模块


// 域名    www.baidu.com:80       www.baidu.com
// 域名 = hostname + port   = host 

let  hostname = "0.0.0.0"   // 127.0.0.1 Ip 主机    *.*.*.*
let  port = 3000;
// (a)=>{}   function(a){}
// let 块级作用域
// const 常量 不可改变 
// req 请求
// res 响应 
let server = http.createServer((req,res)=>{

    if(req.url!=="/favicon.ico"){
        console.log("hello nodejs");
        console.log(req.url);   // 请求的url
        res.setHeader("Content-Type","text/html;charset=utf-8");
        res.write("<h1>hello nodejs</h1>");
        res.write("<h1>node - node - node</h1>");
        res.write("<h1>node - node - node</h1>");
        res.write("node so easy")
        res.end();
    }
});

server.listen(port,hostname,()=>{
    console.log(`this server is running at http://${hostname}:${port}`)
})
