

const url = "https://api.douban.com/v2/movie/top250";

const https = require("https");

const querystring = require("querystring");

var options = {
    hostname:"api.douban.com",
    port:443,
    path:"/v2/movie/in_theaters",
    method:"GET"
}

//  获取其他服务器的数据  

const request =  https.request(options,(res)=>{
    console.log(`状态码 : ${res.statusCode}`);
    console.log(`请求头 : ${querystring.stringify(res.headers)}`);

    var requestData = "";
    var count = 0;

    // 监听数据传输 
    res.on("data",data=>{
        count++;
        console.log(`${count} --- ${data}`);
        requestData+=data;
    })

    // 监听数据传输完毕 
    res.on("end",()=>{
        console.log("end...."+count);
        console.log(JSON.parse(requestData));
        // 写入数据库  
    })
}).on("error",(err)=>{
    console.log(err);
})

// 请求数据 end 
request.end()
