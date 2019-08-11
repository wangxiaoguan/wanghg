
import React,{Component} from "react";
import './react.scss'
export default class React3 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='react3'> 
<pre>{`
    写default props有两种方法
    1 在组件内部的使用static ,ES6写法
        static defaultProps = {
            name:　...
        };
    2 在组件外部ES5,ES6都适用
        App.defaultProps =  {
            name: ...
        };
    ref  this.refs 对象获取  
        1.ref 如果作用于 dom 元素,指向这个真实的DOM 元素  
        2.ref 如果作用于组件,指向是这个组件对象
`}</pre>
<pre>{`
    JSON.parse()
        var data='{"name":"goatling"}'
        ​JSON.parse(data)   =>name:"goatling"
    JSON.stringify()
        var data={name:'goatling'}
        JSON.stringify(data)  =>'{"name":"goatling"}'
`}</pre>
<pre>{`
    web Storage    
    本地客户端网页存储数据的一种方式  以域名为单位存储数据
    操作简单  大小不受限制  不会跟随HTTP 发送给后台 
    localStorage  永久存储   只要不手动删除就永远存储在本地客户端
    sessionStorage 临时存储    只要浏览器关闭或者当页面关闭就会消失
    web storage 存储格式  key-value  {username;"zzz"} 
    取数据  
    localStorage.getItem(key)   localStorage.username 
    存数据
    localStorage.setItem(key,value)  localStorage.key = value;
    删除一条数据
    localStorage.removeItem(key)   delete localStorage[key]
    删除所有数据
    localStorage.clear() 
`}</pre>
            </div>
    
        )
    }
}


