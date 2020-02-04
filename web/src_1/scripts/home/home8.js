
import React,{Component} from "react";
import './home.scss'
export default class Home8 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home8'> 
<pre>{`
    var str="hello world!";
    var str =Number(str);   NaN  number

    var str ="123";
    var str =Number(str);   123  number

    var str ="";//空表示没有
    var str =Boolean(str);  flase  Boolean

    var str =" ";//空格表示有
    var str =Boolean(str);  true  Boolean

    var num =123;
    var str =String(num);   123  string

    var num =123;
    var str =Boolean(num);  true  boolean
    
    var num =0;//数字中0表示没有、不存在；非0表示有
    var str =Boolean(num);  flase  boolean
`}</pre>
<pre>{`
    //延时器写成定时器
    say();
    function say(){
        console.log("hello");
        setTimeout(say,100)
    }
    
    //定时器写成延时器
    var timer=setInterval(function () {
        console.log("hello");
        clearInterval(timer)
    },1000)
`}</pre>
<pre>{`
    for(var i=0;i<10;i++){
        if(i==3)
        continue;
        document.write(i);  //012456789  木有3这个数字
    }
    
    for(var i=0;i<10;i++){
        if(i==3) break;
        document.write(i)  //012   当i=3时停止执行
    }
`}</pre>
<pre>{`
    //数组中对象去重
    // var arr=[
    //     {name:'wang',age:18},
    //     {name:'hong',age:20},
    //     {name:'guan',age:22},
    //     {name:'wang',age:18},
    //     {name:'wang',age:18},
    //     {name:'guan',age:22},
    // ]
    // var hash = {};
    // var arr2 = arr.reduce(function(item, next) {
    //     hash[next.name] ? '' : hash[next.name] = true && item.push(next);
    //     return item
    // }, [])
    // console.log(arr2);


    //数组中非对象去重
    // let arr = ['张三','张三','李四','李四']
    // var set = [...new Set(arr)]
    // console.log(set);
    // console.log(Array.from(set));
`}</pre>
<pre>{`
    常用小标签
    <b>字体加粗标签</b>
    <strong>字体强调加粗（对搜索引擎友好）</strong>
    <br>转行
    <i>倾斜标签<i/>
    <em>强调标签<em/>
    <hr size="20" width="80%" noshade="noshade">水平线
    
    target="_blank"在新窗口打开
    target="_self"在原窗口打开
    <a href="http://www.jd.com" target="_blank">去京东<a/>
    <a class="header" href="#header">返回顶部<a/>
    <a href="">什么都没有，就会刷新<a/>
    <a href=""javascript:;>javascript:;阻止跳转<a/>
`}</pre>
<pre>{`
    var http=require("http"); 
    var hostname="localhost"; //主机ip
    var hostname="127.0.0.1";
    var hostname="0.0.0.0";
    var port=7000; //端口
    var server=http.createServer((req,res)=>{
        res.setHeader("content-type","text/html;charset=utf-8");
        res.write("<h1>好好学习</h1>");
        res.end();
    });
    server.listen(port,hostname,()=>{
        console.log('服务运行于:http://localhost:7000')
    })
`}</pre>
<pre>{`
    var mongodb=require("mongodb");
    var mongoclient=mongodb.MongoClient;
    var table="mongodb://localhost:27017/user";
    mongoclient.connect(table,(err,db)=>{
        try{
            db.collection("movie").find({},{}).toArray((err,result)=>{
                if(err)throw err;
                res.send(result);
            })       
        }catch(err){
            if(err)throw err;
        }
    })
`}</pre>
<pre>{`
    var mysql=require("mysql");
    var content=mysql.createConnection({
        host:"localhost",
        post:3306,
        user:"root",
        password:"root",
        database:"1803"
    });
    content.connect((err)=>{
        if(err)throw err;
        console.log("连接数据库成功")
    })
`}</pre>

            </div>
    
        )
    }
}


