
import React,{Component} from "react";

export default class App5 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div>
                <div className="boxs">
				<h1>定位锚点透明</h1>
				<h3>一、position 定位属性和属性值</h3>
				<div className="marleft"><strong className="oo">position 定位属性，检索对象的定位方式；</strong><br/>
					语法：position：static /absolute/relative/fixed<br/>
					取值：<br/>
					1、static：默认值，无特殊定位，对象遵循HTML原则；<br/>
					2、absolute：绝对定位，将对象从文档流中拖离出来，使用left/right/top/bottom等属性相对其最接近的一个并有定位设置的父元素进行绝对定位；如果不存在这样的父对象，则依据根元素(html)《浏览器》进行定位，而其层叠通过z-index属性定义<br/>
					3、relative ：相对定位，该对象的文档流位置不动，将依据right，top，left，bottom（相对定位）等属性在正常文档流中偏移位置；其层叠通过z-index属性定义<br/>
					4、fixed：(固定定位)未支持，对象定位遵从绝对定位方式（absolute）；但是要遵守一些规范（IE6浏览器不支持此定位） ；<br/>
				</div>
				<h3>二、定位元素的层级属性</h3>
				<div className="marleft">
				<p className="oo">z-index : auto |number</p>
				<p className="oo">检索或设置对象的层叠顺序。<br/>
					auto：默认值。遵从其父对象<br/>
					number:无单位的整数值。可为负数<br/>
					没有设置z-index时，最后写的对象优先显示在上层，设置后，数值越大，层越靠上；<br/>
				</p>
				<p>说明：</p>
				<p>1）较大 数值的对象会覆盖在较小 数值的对象之上。如两个绝对定位对象的此属性具有同样的 number 值，那么将依据它们在HTML文档中声明的顺序层叠。<br/>
					此属性仅仅作用于 position 属性值 relative 或 absolute,fixed 的对象。</p>
				<p></p>
				</div>
				<h3>三、包含块的概念及作用</h3>
				<div className="marleft">
				<p><strong className="oo">包含块是绝对定位的基础，包含块就是为绝对定位元素提供坐标，偏移和显示范围的参照物，即确定绝对定位的偏移起点和百分比 长度的参考；</strong><br/>
					默认状态下，body是一个大的包含块，所有绝对定位的元素都是根据窗口来定自己所处的位置和百分比大小的显示的，如果我们定义了包含元素为包含元素块以后，对于被包含的绝对定位元素来说，就会根据最接近的具有定位功能的上级包含元素来定位自己的显示位置。<br/>
					<strong className="oo">定义元素为包含块：给绝对定位元素的父元素添加声明position：relative；</strong></p>
				<p>如果我们的父素设置了position:absolute;那么子元素也会相对父元素来定义自己的位置。</p>
				<p className="oo">绝对和相对定位的区别</p>
				<p>1、参照物不同，绝对定位（absolute）的参照物是包含块（父级），相对定位的参照物是元素本身位置；</p>
				<p>2、绝对定位将对象从文档流中拖离出来因此不占据空间，相对定位不破坏正常的文档流顺序无论是否进行移动，元素仍然占据原来的空间。<br/>
				</p>
				</div>
				<h3>四、锚点连接的语法和应用场景</h3>
				<div className="marleft">
				<p>命名锚点链接的应用</p>
				<p>定义：<br/>
					是网页制作中超级链接的一种，又叫命名锚记。命名锚记像一个迅速定位器一样是一种页面内的超级链接，运用相当普遍。</p>
				<p>
					<strong className="oo">命名锚点的作用：在同一页面内的不同位置进行跳转。</strong><br/>
					制作锚标记：<br/>
					1)给元素定义命名锚记名<br/>
					语法：&lt;标记   id=&quot;命名锚记名&quot;&gt;    &lt;/标记&gt;<br/>
					2)命名锚记连接<br/>
					语法：&lt;a href=&quot;#命名锚记名称&quot;&gt;&lt;/a&gt;<br/>
				</p>
				</div>
				<h3>五、透明写法</h3>
				<div className="marleft">IE浏览器写法：filter:alpha(opacity=value);取值范围 1-100<br/>
				兼容其他浏览器写法：opacity:0.value;(value的取值范围<br/>
				0-1     0.1,0.2,0.3-----0.9---1)<br/>
				</div>
			</div>

            </div>
        )
    }
}


