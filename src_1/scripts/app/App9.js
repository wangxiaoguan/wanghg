
import React,{Component} from "react";

export default class App9 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app9'>
		<h1>弹性布局</h1>
<p><span>　在网页制作过程中，布局是我们最重要的一个环节。可以说布局的好坏直接影响到整个网页的成败！布局成，则事半功倍；布局败，则事倍功半。 随着移动互联的到来，响应式网站风靡。这也就兴起了一种新兴的布局方式&mdash;&mdash;弹性布局。取代我们之前&ldquo;display+float+position&rdquo;的布局形式，采用全新的弹性布局，会让你的网站如丝般顺滑！ 今天，就让我们一起来学习一下弹性布局，让我们用5个div玩转弹性布局吧~</span></p>
<p><span>　本章内容将详细介绍Android事件的具体处理及常见事件。</span></p>

<p>&nbsp;1 弹性布局简介</p>

<p><span >弹性布局</span>，<span >又称</span>&ldquo;<span >Flex</span><span >布局&rdquo;，是由</span><span >W3C</span><span >老大哥于</span><span >2009</span><span >年推出的一种布局方式。可以简便、完整、响应式地实现各种页面布局。而且已经得到所有主流浏览器的支持，我们可以放心大胆的使用。</span></p>
<p><strong>&gt;&gt;&gt; <span >了解两个基本概念，接下来会频繁提到：</span></strong></p>
<p >①&nbsp;&nbsp;<span >容器：</span> <span >需要添加弹性布局的父元素；</span></p>
<p >②&nbsp;&nbsp;<span >项目：</span> <span >弹性布局容器中的每一个子元素，称为项目；</span></p>
<p>&nbsp;</p>
<p><strong>&gt;&gt;&gt; <span >了解两个基本方向，这个牵扯到弹性布局的使用：</span></strong></p>
<p >①&nbsp;&nbsp;<span >主轴：</span> <span >在弹性布局中，我们会通过属性规定水平</span>/<span >垂直方向为主轴；</span></p>
<p >②&nbsp;&nbsp;<span >交叉轴：</span> <span >与主轴垂直的另一方向，称为交叉轴。</span></p>


<p >&nbsp;2 弹性布局的使用</p>
<p >① 给父容器添加<span >display: flex/inline-flex;</span><span >属性，即可使容器内容采用弹性布局显示，而不遵循常规文档流的显示方式；</span></p>
<p >② 容器添加弹性布局后，仅仅是容器内容采用弹性布局，而容器自身在文档流中的定位方式依然遵循常规文档流；</p>
<p >③ <span >display:flex; </span><span >容器添加弹性布局后，显示为块级元素；</span></p>
<p >display:inline-flex; <span >容器添加弹性布局后，显示为行级元素；</span></p>
<p>④ 设为 <span >Flex</span><span >布局后，子元素的</span><span >float</span><span >、</span><span >clear</span><span >和</span><span >vertical-align</span><span >属性将失效。但是</span><span >position</span><span >属性，依然生效。</span></p>

<p><span >五个简单的</span>div，<span >只给父容器添加了</span>display: flex;<span >属性</span>，<span >就可以让容器内部打破原有文档流模式</span>，<span >展现为弹性布局</span>。</p>
<p><img src="http://wanghg.top/images/flex/a1.png" alt="" /></p>
<p><span >简单的了解一下弹性布局后</span>，<span >我们来详解一下配合</span>&ldquo;display: flex;&rdquo;使用的<span >12</span><span >大属性。其中，</span><span >12</span><span >个属性分为两类，</span><span >6</span><span >个作用于父容器，</span><span >6</span><span >个作用于子项目。</span></p>

<p>&nbsp;3 作为父容器的6大属性</p>
<p><strong>① <span >flex-direction</span><span >属性决定主轴的方向（即项目的排列方向）。</span></strong></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;row<span >（默认值）： 主轴为水平方向，起点在左端；</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;row-reverse<span >： 主轴在水平方向，起点在右端 ；</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;column<span >：主轴为垂直方向，起点在上沿。</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;column-reverse<span >：主轴为垂直方向，起点在下沿。</span></p>
<p>
    <img src="http://wanghg.top/images/flex/a2.png" alt="" />
    <img src="http://wanghg.top/images/flex/a3.png" alt="" />
    <img src="http://wanghg.top/images/flex/a4.png" alt=""  />
    <img src="http://wanghg.top/images/flex/a5.png" alt=""  /></p>
<p><strong>② <span >flex-wrap</span><span >属性定义，如果一条轴线排不下，如何换行。</span></strong></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; nowrap<span >（默认）：不换行。当容器宽度不够时，每个项目会被挤压宽度；</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; wrap<span >： 换行，并且第一行在容器最上方；</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; wrap-reverse<span >： 换行，并且第一行在容器最下方。</span></p>
<p ><span >
    <img src="http://wanghg.top/images/flex/a6.png" alt="" />
<img src="http://wanghg.top/images/flex/a7.png" alt="" />
<img src="http://wanghg.top/images/flex/a8.png" alt="" /></span></p>
<p ><strong><span >③&nbsp;flex-flow <span >是</span><span >flex-direction</span><span >和</span><span >flex-wrap</span><span >的缩写形式，默认值为：</span><span >flex-flow: row wrap;</span>&nbsp;<span >不做过多解释</span></span></strong></p>
<p><strong>④ <span >justify-content</span><span >属性定义了项目在主轴上的对齐方式。</span>&nbsp;</strong></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&gt;&gt;&gt; <span >此属性与主轴方向息息相关。</span></p>
<p ><span > 主轴方向为：</span><span >row-</span><span >起点在左边，</span><span >row-reverse-</span><span >起点在右边， </span><span >column-</span><span >起点在上边，</span><span >column-reverse-</span><span >起点在下边</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;flex-start<span >（默认值）： 项目位于主轴起点。</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;flex-end<span >：项目位于主轴终点。</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;center<span >： 居中</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;space-between<span >：两端对齐，项目之间的间隔都相等。</span><span >(</span><span >开头和最后的项目，与父容器边缘没有间隔</span><span >)</span></p>
<p >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;space-around<span >：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。</span><span >(</span><span >开头和最后的项目，与父容器边缘有一定的间隔</span><span >)</span></p>
<p>&nbsp;
    <img src="http://wanghg.top/images/flex/a9.png" alt="" />
    <img src="http://wanghg.top/images/flex/a10.png" alt="" />
    <img src="http://wanghg.top/images/flex/a11.png" alt="" />
    <img src="http://wanghg.top/images/flex/a12.png" alt="" />
    <img src="http://wanghg.top/images/flex/a13.png" alt="" /></p>
<p><strong>⑤ align-items<span >属性定义项目在交叉轴上如何对齐。</span></strong></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; flex-start<span >：交叉轴的起点对齐。</span></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; flex-end<span >：交叉轴的终点对齐。</span></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; center<span >：交叉轴的中点对齐。</span></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; baseline: <span >项目的第一行文字的基线对齐。</span><span >(</span><span >文字的行高、字体大小会影响每行的基线</span><span >)</span></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; stretch<span >（默认值）：如果项目未设置高度或设为</span><span >auto</span><span >，将占满整个容器的高度。</span></p>
<p>&nbsp;
    <img src="http://wanghg.top/images/flex/a14.png" alt="" />
    <img src="http://wanghg.top/images/flex/a15.png" alt="" />
    <img src="http://wanghg.top/images/flex/a16.png" alt="" />
    <img src="http://wanghg.top/images/flex/a17.png" alt="" />
    <img src="http://wanghg.top/images/flex/a18.png" alt="" /></p>
<p><strong>⑥ align-content<span >属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。</span></strong></p>
<p>&nbsp;(<span ><span >当项目换为多行时，可使用</span>align-content<span >取代</span><span >align-items</span></span>)</p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;flex-start<span >：与交叉轴的起点对齐。</span></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;flex-end<span >：与交叉轴的终点对齐。</span></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;center<span >：与交叉轴的中点对齐。</span></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;space-between<span >：与交叉轴两端对齐，轴线之间的间隔平均分布。</span></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;space-around<span >：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。</span></p>
<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;stretch<span >（默认值）：轴线占满整个交叉轴。</span></p>
<p>&nbsp;
    <img src="http://wanghg.top/images/flex/a19.png" alt="" />&nbsp;&nbsp;&nbsp;
    <img src="http://wanghg.top/images/flex/a20.png" alt="" />&nbsp;&nbsp;
    <img src="http://wanghg.top/images/flex/a21.png" alt="" />&nbsp;
    <img src="http://wanghg.top/images/flex/a22.png" alt="" />&nbsp;&nbsp;
    <img src="http://wanghg.top/images/flex/a23.png" alt="" /></p>


            </div>
        )
    }
}


