
import React,{Component} from "react";
import './array.scss'
export default class Array6 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array6'>
<pre>{`
    var clientX = evt.clientX;  //可视水平方向距离
    var clientY = evt.clientY;  //可视垂直方向距离
    var pageX = evt.pageX;      //实际水平方向距离
    var pageY = evt.pageY;      //实际垂直方向距离
    
    页面的全部宽度
    document.documentElement.scrollWidth || document.body.scrollWidth;
    document.documentElement.scrollHeight || document.body.scrollHeight;
    
    页面的可视宽度
    document.documentElement.clientWidth || document.body.clientWidth;
    document.documentElement.clientHeight || document.body.clientHeight;
    
    页面滚动条滚动的距离
    document.documentElement.scrollLeft || document.body.scrollLeft;
    document.documentElement.scrollTop || document.body.scrollTop;

    box.offsetLeft;                 // 盒子的左边距
    box.offsetTop;                  // 盒子上边距
    box.clientTop=box.clientLeft;   // 盒子边框的厚度
    box.offsetWidth;                // 盒子宽度(包含边框的厚度)
    box.offsetHeight;               // 盒子高度(包含边框的厚度)
    box.offsetParent;               //body 盒子的最近有定位属性的祖先元素
`}</pre>
            </div>
        )
    }
}


