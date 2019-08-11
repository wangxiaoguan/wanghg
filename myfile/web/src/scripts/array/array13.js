
import React,{Component} from "react";
import './array.scss'
export default class Array13 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    send1=()=>{
        fetch('http://api.yytianqi.com/citylist/id/1').then(res=>{
            res.json().then(data=>{
                console.log(data)
            })
        }) 
    }
    send2=()=>{
        fetch('http://api.yytianqi.com/citylist/id/2').then(res=>{
            res.json().then(data=>{
                console.log(data)
            })
        }) 
    }
    send3=()=>{
        fetch('http://api.yytianqi.com/citylist/id/3').then(res=>{
            res.json().then(data=>{
                console.log(data)
            })
        }) 
    }
    render(){
        return(
            <div id='array13'>
<pre style={{padding:0,margin:0,fontSize:20,color:"#f0f"}}>{`
    对象状态值：
    0 = 未初始化（uninitialized） ，open还没有调用
    1 = 正在加载（loading）,服务器连接已建立
    2 = 加载完毕（loaded） ，请求已接收头信息
    3 = 交互（interactive） ，请求处理中，已接收主体信息
    4 = 完成（complete） ，响应已完成

    var req=new XMLHttpRequest();//建立请求的通道
    //var req=new ActiveXObject("Microsoft.XMLHTTP");
    console.log(req.readyState);//0 = 未初始化
    req.open("get","data/test",true);//设置请求的方式和地址,true异步false同步
    console.log(req.readyState);//1 = 正在加载,服务器连接已建立
    req.send();//发送请求
    console.log(req.readyState);//1 = 正在加载,服务器连接已建立
    req.onreadystatechange=function () {
        console.log(req.readyState);
        // alert("你好吗?")
        if (req.readyState==4&&req.status==200){
            alert(req.responseText);
        }
    }


    var req = new XMLHttpRequest();
    req.open("get", "data/city.json", true);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState == 4&&req.status == 200) {
            var result = req.responseText;//字符串
            var list = JSON.parse(result);//数组
        }
    }

    fetch('http://api.yytianqi.com/citylist/id/2').then(res=>{
        res.json().then(data=>{
            console.log(data)
        })
    })
    fetch('http://api.yytianqi.com/citylist/id/3').then(res=>{
        res.json()}).then(data=> {
        console.log(data);
    });
    fetch('http://api.yytianqi.com/citylist/id/1').then(res=>{
        res.json().then(data=>{
            console,log(data)
        })
    })
`}</pre>

            </div>
        )
    }
}


