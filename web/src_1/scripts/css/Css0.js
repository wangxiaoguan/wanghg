
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

    text-decoration: overline;      文本线条line-through,underline,none

    border-spacing:10px 50px;       分隔边框模型中单元格边界之间的距离

    text-align:left;                文本排列方向居中(center)向右(right)

    line-height:20px;               文本行高

    vertical-align:top middle / bottom;             元素的垂直对齐方式middle/bottom

    padding:10px 20px;              内边距

    margin:10px auto;               外边距

    position:relative / absolute / fixed;              相对定位,绝对定位(absolute),固定定位(fixed)

    z-index:1;                      定位层级

    overflow:hidden / auto          当内容溢出元素框时发生的事情

    overflow-x:scroll               横向滚动条
    
    overflow-y:scroll               纵向滚动条

    display:inline / inline-block / block                 元素应该生成的框的类型inline-block,block
    opacity:0.4;                    元素透明度(0.0-1.0)
    filter:alpha(opacity=40);       IE8 及其更早版本(0-100)
    outline:none;                   去除input/textarea蓝色边框
    resize:none;                    去掉textarea右下角斜杠

    perspective:2000px;             3D元素距视图的距离
    transform-style:preserve-3d;    嵌套元素在三维空间中呈现方式
    transform:  scale(-1)           缩放,正值放大,负值缩小
    transform:  translateX(100px)   水平平移,正值向右,负值向左
    transform:  translateY(300px)   垂直平移,正值向下,负值向上
    transform:  skew(45deg)         倾斜,正值向左,负值向右
    transform:  rotate(360deg)      旋转,正值顺时针旋转,负值逆时针旋转

`}</pre> 
 <pre>{`
    background:red url(images/img5.jpg)  no-repeat fixed center;

    background-images:url(images/img5.jpg);

    background-color:red;

    background-position:left top;           (left,top,right,bottom,center,fixed组合)

    background-repeat:no-repeat;            (repeat,repeat-x,repeat-y)

    background-attachment: fixed / scroll / local;           背景固定由浏览器而定的

    background-origin: border-box / padding-box / contant-box

    background-clip: border-box / padding-box / contant-box

    background-size: 100% 100% / 50% / 50% auto / auto 50% / cover / contain 

    cover盒子会铺满，宽高比不变最大化的拉伸图片直到触到内容框的左边和下边为止并且超出图片会被裁切
    contain在保证图片的完整性的前提下，宽高比不变最大化的拉伸图片直到触到内容框的左边或下边为止 	
`}</pre>
<pre>{`    
    app::-webkit-scrollbar{                                 //设置滚动条高宽度
        width: 10px;                                        //竖向滚动条宽度
        height: 10px;                                       //横向滚动条高度
    }
    app::-webkit-scrollbar-track{                           //滚动条轨道
        box-shadow:inset 0 0 6px rgba(43, 43, 43, 0.3) ;
        border-radius: 10px;
    }
    app::-webkit-scrollbar-thumb {                          //滚动条滑块
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.1);
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }`}</pre>
<pre>{`
    单文本省略号
    .text{
        width:200px;/*必须是固定宽度值*/
        overflow:hidden;/*超出部分隐藏*/
        text-overflow:ellipsis;/*超出部分显示省略号*/
        white-space:nowrap;/*规定段落中的文本不进行换行 */
    }
    多行文本省略号
    .text{
        width:200px;/*必须是固定宽度值*/
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow:hidden;/*超出部分隐藏*/
    }
`}</pre>
<pre>{`
    IE9浏览器实现overflow样式属性
    float:left;
    overflow:hidden;
    两个样式属性一起用才有效果
`}</pre>
<pre>{`
    ::selection{color:red;}                 //选择文本

    h1::before{content:"你好";}
    h1::after{content:"大家好";}
    /*before与after只能在双标签上使用，并且使用单冒号和双冒号都一样，IE8不支持*/

    div:not(.div1){color:green;}
    li:not(:first-child){background: blue;}
    li:nth-child(2n){color:#ffd3d3;}
    p+h3{color:#ffd3d3;}/*p后面紧跟第一个h3*/
    p~h3{color:#f88787;}/*p后面所有的h3*/
    p>h3{color:#ff0000;}
`}</pre>
<pre>{`    网页适应不同的分辨率
    @media screen and (min-width:100px) and (max-width:600px){ }
    @media screen and (min-width:601px) and (max-width:1200px){ }
    @media screen and (min-width:1201px) and (max-width:1800px){ }
    @media screen and (min-width:1801px){ }
`}</pre>

            </div>
    
        )
    }
}


