
// 客户端socket 
var ws = new WebSocket("ws://172.17.170.178:3000");  //WebSocket 连接服务器的socket

// 监听客户端连接服务器 socket  
ws.onopen = function(){
    ws.send("大家好...");  // send 发送信息  发送给服务器socket
}


// 客户端 socket 监听服务端 socket 发来的消息 
ws.onmessage = function(event){
    console.log(event);
    var chatroom = document.getElementById("chatroom");
    chatroom.innerHTML += event.data;
}

// 监听服务端socket error
// ws.onerror = function(err){
//     console.log("error"+err);
// // }

// // // 监听服务器 socket 关闭 
// // ws.onclose = function(){
// //     alert("server socket is closed")
// // }