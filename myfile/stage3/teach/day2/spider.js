
const url = "https://www.lagou.com/";

const http = require("http");

const https = require("https");

const querystring =  require("querystring");

const cheerio = require("cheerio");


// res 响应 
https.get(url,(res)=>{
    console.log('状态码：', res.statusCode);
    console.log('请求头：', querystring.stringify(res.headers));
    
    var htmlData = "";
    var count = 0;
    // 监听响应的数据传输  
    res.on("data",(thunk)=>{
        count++;
        console.log(`数据===... count===${count}`)
        htmlData+=thunk;
    });

    // 监听数据传输完毕 
    res.on("end",()=>{
        console.log("数据传输结束");
        listData(htmlData);
    })
}).on('error',(e)=>{
    console.log(e);
});



// function jQuery(){
//     this
// }

// jQuery.ajax = function(){

// }
// jQuery.each = function(){

// }
// jQuery.prototype.show = funtion(){

// }
// jQuery.fn.hide = function(){

// }

// window.$ = window.LOL = window.jQuery;

// $  jQuery    全局对象  静态对象   $.each $.ajax 
// $.fn  $.prototype    jQuery.prototpye jQuery.fn c  实例化对象  原型对象   $('p').show  $('p').text()  $.fn.show = function(){}

// $.extends    $.fn.extedns

// var op = document.getElementById("p");  
// dom 对象如何转jquery 对象  op    ===>  $(op)
// jquery 对象如何转 DOM 对象   $("#p")  ===> $("#p")[0]  $("#p").get(0)

function listData(data){
    const $ = cheerio.load(data);  // 后端  html 代码  加载成dom 元素 
    var menu = $(".menu_main");    // 数组 dom数组 伪数组 
    var myData= [];
    menu.each((index,item)=>{

        var menuTitles = $(item).find("h2").text();
        console.log(menuTitles);

        var menuLists = $(item).find("a")   // dom 对象集合的数组  

        var subMenuLists = [];
        menuLists.each((index,item)=>{     //  item 不是jquery 对象  DOM 对象 
            subMenuLists.push($(item).text())
        })
        console.log(subMenuLists);
        myData.push({
            menuTitles,
            subMenuLists
        })
    });

    append(myData)
}

var fs = require('fs');


function append(data){
    //  item  当前活跃的元素  index 下标   list 当前数组 
    data.forEach((item,index,list)=>{
        fs.appendFile("./logs/lagou.txt",`${item.menuTitles}  \n   ====================\n`,'utf-8',(err)=>{
            if(err) throw err;
            console.log("写入标题成功");
        });

        item.subMenuLists.forEach((val,idx)=>{
            fs.appendFile("./logs/lagou.txt",`${val} \n` ,err=>{
                if(err) throw err;
                console.log("写入职位成功")
            })
        })
    })

}