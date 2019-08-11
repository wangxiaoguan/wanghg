

// 服务端 socket socket.io 


var express = require("express");

var app = express();  // express().Router

var server = require("http").Server(app);

var io = require("socket.io").listen(server);  // 网络通信  服务端socket

var port = 6000;

// var hostname = "0.0.0.0";
var hostname = "localhost";

var fs = require("fs");

var querystring = require("querystring");

app.get("/wh1803",(req,res)=>{
    res.send("wh1803 daydayup ~~~")
})

// app.get()
// app.post()
// app.all()
// app.use()
// app.set()

app.get("/index",(req,res)=>{
    fs.readFile("./socketIo.html","utf-8",(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
})
app.use("/",express.static(__dirname+"socketIo.html"))   // 设置静态资源文件路径



// 服务端
// 1. 监听 client 的连接上线
// 2. 监听 client 发来的消息
// 3. 监听 client error
// 4. 监听 client 关闭

var onLineUser = {};
var i = 0;
var onLineUserCount = 0;
var username = [];

// 1. 监听 client 的连接上线
io.on("connection",(socket)=>{
    console.log(`${querystring.stringify(socket)}   上线了...`);
    

    socket.on("login",(value)=>{
        onLineUserCount++;
        console.log(value);
        username.push(value);
        socket.name = value;
        socket.emit("loginSuccess");  // 只能发送给 对应的 用户  
        io.sockets.emit("setUserCount",onLineUserCount);  // 系统消息 发送给所有在线用户 
        io.sockets.emit("system",value);
    })

    socket.on("message",(msg)=>{
        console.log(msg);
        io.sockets.emit("sendMsg",socket.name,msg);
    })


    // 监听客户端client socket 关闭
    socket.on("disconnect",()=>{
        onLineUserCount--;
        io.sockets.emit("setUserCount",onLineUserCount); // 人数减少
        socket.broadcast.emit("sendMsg",socket.name,"886 , 我 走了 ...")  // broadcast 广播  发送给除了自己以外的用户
    })
})



server.listen(port,hostname,()=>{
    console.log(`socket server is running at http://${hostname}:${port}`)
})