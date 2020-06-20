
import React,{Component} from "react";
import PropTypes from 'prop-types'
import './react.scss'
class React3 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    static defaultProps = {    word:"你好", age:18   }

    static childContextTypes = {//检测的数据类型，传递给下一级
        msg:PropTypes.string,
        number:PropTypes.number,
    }
    getChildContext(){ //设置context数据
        return {
             msg:"中华", 
             number:66666 
        } 
    }

    state = { hello:"1803 每天学到晚上2点", msg:"沉迷学习无法自拔" }
    render(){
        console.log(this,this.state,this.props)
        return(
            <div id='react3'> 
<pre>{`
    写defaultProps有两种方法
    1 在组件内部的使用static ,ES6写法(内部优先级大于外部优先级)
        static defaultProps = {
            name:　...
        };
    2 在组件外部ES5,ES6都适用
        App.defaultProps =  {
            name: ...
        };


    写state两种方法,都在组件内部
    1 constructor(props){//第一种优先级大于第二种
        super(props);
        this.state={
            name: ...
        }
    }
    2 state = { name: ... }
 
    写context两种方法,都在组件内部
    react V.16版本以上
    [需要引入import PropTypes from 'prop-types']
    组件内部用法
    static childContextTypes = {//检测的数据类型，传递给下一级
        arr: PropTypes.array, //数组
        bool: PropTypes.bool,//布尔
        fun: PropTypes.func,//函数
        num: PropTypes.number,//数字
        obj: PropTypes.object,//对象
        str: PropTypes.string,//字符串
        Symbol: PropTypes.symbol,//符号
    }
    组件外部用法(App组件名称)
    App.childContextTypes = {//检测的数据类型，传递给下一级
        arr: PropTypes.array, //数组
        bool: PropTypes.bool,//布尔
        fun: PropTypes.func,//函数
        num: PropTypes.number,//数字
        obj: PropTypes.object,//对象
        str: PropTypes.string,//字符串
        Symbol: PropTypes.symbol,//符号
    }
    getChildContext(){ //设置context数据(组件内部)
        return {
             str:"中华", 
             num:6666,
             bool:false,
             obj:{name:'wang'},
             fun:()=>{console.log('1111')},
             arr:[1,2,3,4,5,6,7,8,9],
        } 
    }

    下级调用上级传过来的context
    static contextTypes = {//检测的数据类型，传递给下一级(组件内部)
        arr: PropTypes.array, //数组
        bool: PropTypes.bool,//布尔
        fun: PropTypes.func,//函数
        num: PropTypes.number,//数字
        obj: PropTypes.object,//对象
        str: PropTypes.string,//字符串
        Symbol: PropTypes.symbol,//符号
    }
    this.context————>获取context


    this.refs 对象获取  
    1.ref 如果作用于 dom 元素,指向这个真实的DOM 元素  
    2.ref 如果作用于组件,指向是这个组件对象
    <div ref='root'></div>————>获取该元素this.refs.root
    <App ref='box'/>——————————>获取该元素this.refs.box

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
`}</pre><App/>
            </div>
    
        )
    }
}
// React3.defaultProps = {
//     num:'11111111111111111'
// }
React3.childContextTypes = {//检测的数据类型，传递给下一级
    msg:PropTypes.string,
    number:PropTypes.number,
}

class App extends Component{
    static contextTypes = {//检测的数据类型，传递给下一级
        msg:PropTypes.string,
        number:PropTypes.number,
    }
    render(){
        console.log(this)
        return(
            <div></div>
        )
    }
}
export default React3

