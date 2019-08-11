
import React,{Component} from "react";
import './array.scss'
export default class Array1 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array1'>
<pre style={{padding:0,margin:0,fontSize:20,color:"#f0f"}}>{`
    字符串String命名法5种:
    var str0 = "abc";               基本类型:string
    var str1 = String("abc");       基本类型:string
    var str2 = new String("abc");   引用类型Object:string
    var str3 = 'abc';               基本类型:string
    var str4 = abc;                 反单引号 基本类型:string

    var str = "hello";
    str[0];                         //位置的字符
    str.charAt(0);                  //取指定位置的字符
    str.charCodeAt(0);              //取指定位置字符所对应的ascii编码
    String.fromCharCode(97);        //把指定的编码转成字符串
    [A-Z]:65-90
    [a-z]:97-122
    [0-9]:48-57

    字符串编码
    var str = "中国梦";
    escape(str);
    unescape(str);

    encodeURI(str);
    decodeURI(str);

    encodeURIComponent(str);
    decodeURIComponent(str);
    
    合并字符串
    var str ="0123456789";
    var str1="abcdefgh";
    str.concat(str1);               //0123456789abcdefgh

    var str="12abc";
    str.indexOf(2);                 //1  隐式类型转换
    str.indexOf("2");               //1
    str.indexOf(a);                 //报错
    str.indexOf("a");               //2
    str.search("12");               //返回下标值0

    str.match(/[0-9]/g) ;           //查找
    str.replace(0,"千");            //替换
    str.replace(/0-9/g, "");        //正则替换
    str.split("-");                 //切割字符串，返回数组
    
    var str ="abcdefg";
    str.slice(0,3);                 //abc,包起点不包终点
    str.substring(1)                //bcdefg
    str.substring(0,2);             //ab截取字符串包起点不包终点
    
    str.toUpperCase();              //把字母全部转换大写
    str.toLowerCase();              //把字母全部转换小写
    
    str.trim("");                  //去除空格
`}</pre>

            </div>
        )
    }
}


