

const http = require("http");
const hostname=  "0.0.0.0";
const port = 3000;

var url = require("url");

var route = require("./route");
console.log(route);

// 路由  根据不同路由地址  返回对应的数据
const server = http.createServer((req,res)=>{
    
    if(req.url!=="/favicon.ico"){

        console.log(req.url);
        // 获取路由 path 
        var pathname = url.parse(req.url,true).pathname.replace(/\//,"");
        // res.writeHead(200,{'Content-Type':"text/html;charset=utf-8"});
        // route.pathname route.home   pathname 当做函数名

        try{
            route[pathname](req,res)   // route['img']
        }catch(err){
            console.log("404");
            route['home'](req,res);
        }
       
    }
 
}).listen(port,hostname,()=>{
    console.log(`this server is running at http://${hostname}:${port}`)
})

function writeData(res,data){
    res.write(data);
    res.end();
}



