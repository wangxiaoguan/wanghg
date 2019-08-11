// var ws=require("ws");

// var websocketserver=ws.Server;

// const port=3000;

// var wss=new websocketserver({port});

// var clientusermap={};

// var count=0;

// var info="111111111111";
// var querystring=require("querystring");
// wss.on("connection",(ws)=>{
//     count++;
//     ws.name=info+count;
//     clientusermap[ws.name]=ws;


//     ws.on("message",msg=>{
//         console.log(msg);
//         broadcast(msg,ws);
//     });

//     ws.on("close",()=>{
//         console.log(`${ws.name} 下线了...` );
//         delete clientusermap[ws.name]; 
//         broadcast("我下线了... 886",ws);
//     });


//     setInterval(()=>{
//         var date = new Date();
//         var sec = date.getSeconds();

//         if(sec%3==0){
//             broadcast("系统消息: 现在是随机推送新闻...<br>",ws);
//         }
//     },1000);

// })

// function broadcast(msg,ws){
//     for(var key in clientusermap){
//         clientusermap[key].send(`${ws.name}说:${msg}<br/>`)
//     }
// }


///////////////////////////////////////////////////////////////////////////////////////

// console.log("服务端socket");

var ws = require("ws");

// console.log(ws);

var WebSocketServer = ws.Server;

const port = 5000;

var wss = new WebSocketServer({port});  // 服务器 socket 监听 3000;



var clientUserMap = {};
var count = 0;
var info = "武汉1803_"

var querystring = require("querystring");
// 监听客户端 client 连接 
wss.on("connection",(ws)=>{
    console.log(`${querystring.stringify(ws)} 已经上线了...` );
    count++;
    ws.name = info +count;
    clientUserMap[ws.name] = ws;

    // 监听 client socket  发来消息
    ws.on("message",msg=>{
        console.log(msg);
        // 接收到的消息  转发给其他的在线 用户 
        broadcast(msg,ws);
        
    });

    // 监听客户端 socket 关闭 
    ws.on("close",()=>{
        console.log(`${ws.name} 下线了...` );
        delete clientUserMap[ws.name]; 
        broadcast("我下线了... 886",ws);
    });

    // setInterval(()=>{
    //     var date = new Date();
    //     var sec = date.getSeconds();

    //     if(sec%3==0){
    //         broadcast("系统消息: 现在是随机推送新闻...<br>",ws);
    //     }
    // },1000);

})
// 广播 
function broadcast(msg,ws){
    for(var key in clientUserMap){
        clientUserMap[key].send(` ${ws.name} 说 : ${msg} <br>`);
    }
}