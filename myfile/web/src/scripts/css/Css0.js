
import React,{Component} from "react";
import './css.scss'
export default class Css0 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='css0'> 
<pre>{`
    CSS样式词语
    width:100px;                    元素的宽度
    height:200px;                   元素的高度
    font-family:"宋体";             字体样式
    font-size:20px;                 字体大小
    color: red;                     字体颜色(#123456)(rgb(107, 5, 5))
    font-style:italic;              字体风格normal(正常)italic(倾斜)
    font-weight: bold;              字体加粗normal(正常)bold(加粗) 
    border:1px solid black          边框样式
    border-width: 5px;              边框宽度
    border-color:green;             边框颜色
    border-style:double;            边框风格solid(实线)dashed(虚线)double(双实线) 
    list-style-type: none;          列表是否显示空心圆(circle)，实心圆(disc)，方块(square)，无(none)
    a:visited{};                    点击浏览后样式
    a:hover{};                      悬停时样式
    a:active{};                     点击同时样式
    pointer-events:none;            a标签不可点击
    resize:none;                    textarea去掉右下角三角图标
    text-decoration: overline;      文本线条line-through,underline,none
    border-spacing:10px 50px;       分隔边框模型中单元格边界之间的距离
    text-align:left;                文本排列方向居中(center)向右(right)
    line-height:20px;               文本行高
    vertical-align:top;             元素的垂直对齐方式middle/bottom
    padding:10px 20px;              内边距
    margin:10px auto;               外边距
    position:relative;              相对定位,绝对定位(absolute),固定定位(fixed)
    z-index:1;                      定位层级
    overflow:hidden                 当内容溢出元素框时发生的事情scroll/auto
    overflow-x:scroll               横向滚动条
    overflow-y:scroll               纵向滚动条
    display:inline                  元素应该生成的框的类型inline-block,block
    opacity:0.4;                    元素透明度(0.0-1.0)
    filter:alpha(opacity=40);       IE8 及其更早版本(0-100)
    outline:none;                   去除input/textarea蓝色边框
    resize:none;                    去掉textarea右下角斜杠

    perspective:2000px;             3D元素距视图的距离
    transform-style:preserve-3d;    嵌套元素在三维空间中呈现方式
    transform:scale(-1)             缩放,正值放大,负值缩小
    transform:translateX(100px)     水平平移,正值向右,负值向左
    translateY(300px)               垂直平移,正值向下,负值向上
    transform:skew(45deg)           倾斜,正值向左,负值向右
    transform:rotate(360deg)        旋转,正值顺时针旋转,负值逆时针旋转

    column-count:4;                             元素内容将被划分的列数,适用于瀑布流
    -moz-column-count:4;                        Firefox 
    -webkit-column-count:4;                     Safari 和 Chrome

    column-gap:40px;                            规定列之间的间隔
    -moz-column-gap: 40px;                      Firefox 
    -webkit-column-gap: 40px;                   Safari 和 Chrome 
    
    column-rule:3px outset #ff00ff;             设置列之间的宽度，样式和颜色
    -moz-column-rule:3px outset #ff00ff;        Firefox 
    -webkit-column-rule:3px outset #ff00ff;     Safari and Chrome 

    background:red url(http://wanghg.top/images/img5.jpg)  no-repeat fixed center;
    background-images:url(http://wanghg.top/images/img5.jpg);
    background-color:red;
    background-position:left top;           (left,top,right,bottom,center,fixed组合)
    background-repeat:no-repeat;            (repeat,repeat-x,repeat-y)

    background-attachment: fixed;           背景固定由浏览器而定的
    background-attachment: scroll;
    background-attachment: local;

    background-origin:border-box;
    background-origin:padding-box;
    background-origin:contant-box;

    background-clip:border-box;
    background-clip:padding-box;
    background-clip:contant-box;

    background-size:50% 50%; 
    background-size:50% 
    background-size:50% auto 
    background-size:auto 50% 
    background-size:cover 
    background-size:contain 
    cover盒子会铺满，宽高比不变最大化的拉伸图片直到触到内容框的左边和下边为止并且超出图片会被裁切
    contain在保证图片的完整性的前提下，宽高比不变最大化的拉伸图片直到触到内容框的左边或下边为止 	
`}</pre>
            </div>
    
        )
    }
}


