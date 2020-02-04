
import React,{Component} from "react";
import './home.scss'
export default class Home10 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home10'> 
<pre>{`
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    // 判断浏览器是否支持桌面通知
    if(Notification){
        Notification.requestPermission(function(result){
            //result 默认值'default'等同于拒绝 'denied' -用户选择了拒绝 'granted' -用户同意启用通知
            if("granted" != result){
                alert('请授权浏览器能够进行通知!');
                return false;
            }else{
                var tag = "sds"+Math.random();
                var notify = new Notification(
                    title,
                    {
                        dir:'auto',
                        lang:'zh-CN',
                        tag:tag,//实例化的notification的id
                        icon:imgUrl,//通知的缩略图,icon 支持ico、png、jpg、jpeg格式
                        title:title, //通知的标题
                        body:msg //通知的具体内容
                    }
                );
                // 定义通知窗口点击函数
                notify.onclick=function(){
                    //如果通知消息被点击,通知窗口将被激活
                    window.focus();
                };
                // 定义通知错误事件
                notify.onerror = function () {
                    // console.log("");
                };
                // 定义通知显示事件 可以设置多少秒之后关闭 也可以不设置关闭
                notify.onshow = function () {
                    // 窗口显示 播放音频
                    var audio = new Audio("./10418.wav");
                    audio.play();
                    // 窗口显示3S后关闭
                     setTimeout(function(){
                         notify.close();
                     },3000);
                };
                // 定义通知关闭事件
                notify.onclose = function () {
   
                };
            }
        });
    }else{
        // 提示不支持系统通知
        alert('您的浏览器不支持系统通知,建议使用Chrome浏览');
    }
  }
   
    showNotification('通知标题','这是一条测试通知啦啦啦啦啦了啦啦啦啦啦阿拉拉了','./demo.jpg');
`}</pre>
            </div>
    
        )
    }
}


