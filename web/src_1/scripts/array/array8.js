
import React,{Component} from "react";
import './array.scss'
export default class Array3 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array3'>
<pre>{`
    // cookie
    // 名称      name
    // 内容      value
    // 路径      path
    // 域名      domain
    // 失效时间  expires
    function setCookie(key, value, days) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        document.cookie = key + "=" + value + ";expires=" + date;
    }
    
    function getCookie(key) {
        var cookies = document.cookie;
        if (cookies) {
            var cookieList = cookies.split("; ");
            var value = "";
            cookieList.forEach(function (cookie) {
                var item = cookie.split("=");
                var itemKey = item[0];
                var itemValue = item[1];
                if (itemKey == key) {
                    value = itemValue;
                    return false;//终止里面函数的执行
                }
            });
            return value;
        } else {
            return "";
        }
    }
`}</pre>
            </div>
        )
    }
}


