
import React,{Component} from "react";
import './array.scss'
export default class Array23 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array23'>
<h1>fetch、ajax、jsonp、cors、跨域</h1>
<pre>{`
    
    关于跨域
    根据浏览器同源策略（协议、域名、端口一致为同源），凡是发送请求的源与当前页面的源不同的即为跨域。同源策略用于隔离潜在的恶意文件。
    解决方式
    JSONP：只支持GET，不支持POST请求；
    原理：浏览器只对XHR请求有同源限制，对script标签src属性，link标签ref属性和img标签src属性没有限制。
    代理：使用代理去避开跨域请求，写一个后台接口，在后端去调用该不通源请求地址；
    服务端修改：在服务端页面添加header限制：
    Header(‘Access-Control-Allow-Origin:*’)//允许所有来源访问
    Header(‘Access-Control-Allow-Method:POST,GET’)//允许访问的方式
    关于CORS跨域资源共享机制
    CORS跨域资源共享机制，允许web应用服务器进行跨域访问控制。
    CORS允许在下列场景中使用跨域http请求：
    XMLHttpRequest或Fetch发起的跨域HTTP请求；Web字体；WebGL贴图；样式表（使用CSSOM）；
    使用drawImage将Images/video 画面绘制到canvas。
    CORS标准新增了一组http首部字段，允许服务器声明哪些源站通过浏览器可以访问哪些资源。
    
    用fetch向后端发送post请求，会产生两个请求OPTIONS和POST的原因
    另外，规范要求，对那些可能对服务器数据产生副作用的请求，必须首先使用options方法发起预检请求，
    获知服务端是否允许该跨域请求，允许之后才发起实际的HTTP请求，在预检返回的结果中，
    服务端也可以通知客户端是否需要携带身份凭证（cookies和http认证相关数据）。


    fetch请求和ajax请求

        ajax
        1.是XMLHTTPRequest的一个实例

        2.只有当状态为200或者304时才会请求成功

        3.格式零散，容易出现回调地狱的问题

        fetch
        1.fetch是基于promise实现的，也可以结合async/await

        2.fetch请求默认是不带cookie的，需要设置fetch（URL，{credentials:’include’})。 

        Credentials有三种参数：same-origin，include，*

        3.服务器返回400 500 状态码时并不会reject，只有网络出错导致请求不能完成时，fetch才会被reject

        4.所有版本的 IE 均不支持原生 Fetch

        5.fetch是widow的一个方法
`}</pre>
            </div>
        )
    }
}


