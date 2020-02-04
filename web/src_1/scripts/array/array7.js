
import React,{Component} from "react";
import './array.scss'
export default class Array7 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array7'>
<pre>{`
    元素节点获取
    document.getElementById("app");             //单个唯一元素节点
    
    document.getElementsByClassName("app");     //伪数组,IE8及以下不支持
    
    document.getElementsByTagName("div");       //伪数组

    document.getElementsByName("app");          //伪数组,有兼容性问题
 
    获取下一个节点兼容
    if(obj.nextElementSibling) {  
        return obj.nextElementSibling  
    }else { 
        return obj.nextSibling  
    }
    
    获取上一个节点兼容
    if(obj.previousElementSibling){
        return obj.previousElementSibling 
    }else {
        return obj.previousSibling
    }
    
    //元素节点操作
    document.parentNode;                            //获取父节点
    document.previousElementSibling;                //获取上一个元素节点
    document.nextElementSibling;                    //获取下一个元素节点
    document.createElement("标签名");                //新建一个元素节点
    document(父标).appendChild("子标");              //把字标签添加父标签内
    document(父标).replaceChild("新子标","旧子标");   //用新标签替代旧标签
    document(父标).insertBefore("新子标","某子标");   //在某标签前插入新标签
    document(父标).removeChild("某子标");            //删除某子标签

    //属性节点获取
    var obj=document.getElementById("obj");         //获取元素节点
    obj.attributes;                                 //获取元素节点的整个属性的集合
    obj.getAttribute("class");                      //获取class的属性值
    obj.getAttribute("id");                         //获取id的属性值
    obj.getAttribute("style");                      //获取style的属性值
    obj.removeAttribute("class");                   //移除class属性
    obj.setAttribute("class","box");                //设置box节点一个属性和属性值
    obj.attributes[0].nodeValue;                    //获取第一个属性的属性值

    获取元素某属性的某属性值
    function getStyleAttr(obj,attr) {
        if (window.getComputedStyle){
            return getComputedStyle(obj)[attr]
        }else {
            return obj.currentStyle[attr]
        }
    }
    
    nodeName:       获取元素的标签名称
    nodeValue：      获取文字节点的内容
    nodeType:        返回节点类型，1为标签（元素），2为属性，3为文字节点
    childNodes       子节点对象集合(只包括文本和元素节点)
    childNodes       在低版本IE中，会自动忽略掉空白的文本节点，其他浏览器不会忽略
    firstChild:      childNodes (孩子节点数组)列表中第一个节点。
    lastChild:       childNodes (孩子节点数组)列表中的最后一个节点。
    
    
    
    BOM浏览器对象模型

    window的子对象
    document     文档对象
    iframe       外部框架对象
    history      历史对象
    location     地址对象
    navigator    代理信息对象
    screen       屏幕对象
    
    cookie
    名称      name
    内容      value
    路径      path
    域名      domain
    失效时间  expires
    
    window.location.reload()    会重新加载当前页面
    window.location.search      返回问号后的字段
    window.location.href        当前页面打开URL页面
    window.open()               打开URL页面
    
    window.history.forward();   前进
    window.history.back();      后退
    window.history.go(2);       前进两次
    
    
    window.navigator            电脑代理信息
    window.screen.height        表示电脑屏幕的高度,跟浏览器没有任何关系
    window.screen.width         表示电脑屏幕的高度,跟浏览器没有任何关系
    window.onscroll             监控滚动条
    
    

`}</pre>
            </div>
        )
    }
}


