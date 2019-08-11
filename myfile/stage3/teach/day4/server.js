

const http = require("http");
const hostname=  "0.0.0.0";
const port = 3000;

var url = require("url")
// 路由  根据不同路由地址  返回对应的数据
const server = http.createServer((req,res)=>{
    
    if(req.url!=="/favicon.ico"){

        console.log(req.url);
        // 获取路由 path 
        var pathname = url.parse(req.url,true).pathname.replace(/\//,"");
        res.writeHead(200,{'Content-Type':"text/html;charset=utf-8"});
        
        if(pathname=="home"){
            writeData(res,'<h2>home-home-home</h2>')
        }else if(pathname=="login"){
            writeData(res,'<h2>login-login</h2>')
        }
        else{
            writeData(res,'<h2>404 - 404 not Found</h2>')
        }
       
        // res.write(`<h1>wh1803 daydayup</h1>`);
        // res.write(`<h1>learn more node</h1>`)
        // res.end();
        
    }
 
}).listen(port,hostname,()=>{
    console.log(`this server is running at http://${hostname}:${port}`)
})

function writeData(res,data){
    res.write(data);
    res.end();
}



