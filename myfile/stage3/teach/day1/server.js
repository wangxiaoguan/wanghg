


const http = require("http"); 

const hostname = "0.0.0.0"; 

const port = 3000;

const course = "千锋教育HTML"


var module = require("./module"); 


var {arr} = require("./module");


var [a,c,b] = require("./arr");

var {User} = require("./user");

var u1 = new User("大雷",18,"123,走你"); // 实例化

var {UserClass} = require("./UserClass");

var u2 = new UserClass("小红英",20,"我要减肥","保密");

http.createServer((req,res)=>{
    if(req.url!=="/favicon.ico"){
        console.log("node server ...");
        console.log(req.url);
        res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        res.write("<h1>learn more about node</h1>");
        res.write("<b>send json by search from table mysql/mongodb</b>")
        res.write(`<h3>你真的知道吗? ${course}</h3>`)
        res.write(`<h3>${module.word}---${module.arr[1]}----${module.person.say()} ----- ${arr[0]}</h3>`)
        res.write(`<h3>${a} --- ${b}</h3>`)
        res.write(`<h3>${u1.name} --- ${u1.word}.  ${u1.say()}  - ${u1.msg} </h3>`)
        res.write(`<h3>${u2.name} --- ${u2.salary}. ${u2.say()} - ${u2.walk()} </h3>`)
        res.end();
    }

}).listen(port,hostname,()=>{
    console.log(`this server is running at http://${hostname}:${port}`)
})