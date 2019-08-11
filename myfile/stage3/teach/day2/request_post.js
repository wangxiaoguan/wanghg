


const http  = require("http");
const url = "http://www.codingke.com/ajax/create/course/question";

const querystring = require("querystring");

const postData =  querystring.stringify({
    "question[title]":'1803whwhwhwh----table',
    "question[content]":"<p>qqq</p>",
    "question[courseId]":227,
    "question[lessonId]":2032,
    "_csrf_token":"fe0336d42f7b7a0112bf8cba0b042c284e1b941a"
});


const options = {
    hostname:"www.codingke.com",
    port:80,
    path:"/ajax/create/course/question",
    method:"POST",
    headers:{
        'Accept':'*/*',
        'Accept-Encoding':'gzip, deflate',
        'Accept-Language':'zh-CN,zh;q=0.8',
        'Connection':'keep-alive',
        'Content-Length':postData.length,
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie':'MEIQIA_EXTRA_TRACK_ID=0v4BSdQcFIcyupeIQhF9oHZ7Sjj; Hm_lvt_9f92046de4640f3c08cf26535ffdd93c=1508228398,1508228403,1508230844,1508836284; 53gid2=10446476619009; 53revisit=1521526596246; UM_distinctid=163aec359688d-03525ad0ae740d-404c0628-100200-163aec3596f5b; tgw_l7_route=ba4a4fa767ccc5ac6060ead23a114820; PHPSESSID=skr3uq12tpvphuba67fj7pqkj2; 53gid0=10446476619009; 53gid1=10446476619009; 53kf_72165667_from_host=www.codingke.com; 53uvid=1; onliner_zdfq72165667=0; visitor_type=old; CNZZDATA1256018185=1057478597-1507798971-%7C1531189856; Hm_lvt_7d5fe787f1dd300413ad4b53656dc0b1=1531193222,1531193293,1531193316; Hm_lpvt_7d5fe787f1dd300413ad4b53656dc0b1=1531193461; 53kf_72165667_keyword=https%3A%2F%2Fwww.sogou.com%2Flink%3Furl%3DDSOYnZeCC_obk5epK05QRdV9GaRIQqf7reaVHN88tHY.; 53kf_72165667_land_page=http%253A%252F%252Fwww.codingke.com%252F; kf_72165667_land_page_ok=1; Invite_code=295142',
        'Host':'www.codingke.com',
        'Origin':'http://www.codingke.com',
        'Referer':'http://www.codingke.com/v/1744-lesson',
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
        'X-CSRF-Token':'fe0336d42f7b7a0112bf8cba0b042c284e1b941a',
        'X-Requested-With':'XMLHttpRequest'
    }
}

// 发送请求

const req = http.request(options,res=>{
    console.log(`状态码 : ${res.statusCode}`);
    console.log(`请求头 : ${querystring.stringify(res.headers)}`);

    res.setEncoding("utf8");

    // 监听数据传输 
    res.on("data",data=>{
        console.log(`响应的数据主体 -- ${data}`)
    });
    
    res.on("end",()=>{
        console.log("响应的数据提交完毕  ----数据注入成功successful");
    })
})

// 监听error 
req.on('error',err=>{
    console.error(`响应数据遇到error -  ${err.message}`);
})

// 写入数据到请求主体 
req.write(postData);

req.end();