
import React,{Component} from "react";

export default class App6 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div>
                <h1>css盒模型和文本溢出</h1>
				<h3>一、css属性和属性值的定义</h3>
				<p>盒模型是css布局的基石，它规定了网页元素如何显示以及元素间相互关系。css定义所有的元素都可以拥有像盒子一样的外形和平面空间，即都包含边框、边界、补白、内容区，这就是盒模型.</p>
				<h3>二、盒子模型的相关元素</h3>
    <ul>
    	<li>
    		<span className="oos">1、padding的使用方法</span>
            <div className="textcon">
    		<p><b>说明：</b></p>
			<p>填充：padding,在设定页面中一个元素内容到元素的边缘(边框) 之间的距离。 也称补白。</p>
			<p><b>用法：</b></p>
			<p>1）用来调整内容在容器中的位置关系</p>
			<p>2）用来调整子元素在父元素中的位置关系。</p>
			<p>注：padding属性需要添加在父元素上。</p>
			<p>3）padding值是额外加在元素原有大小之上的，如想保证元素大小不变，需从元素宽或高上减掉后添加的padding属性值</p>
			<p><b>属性值的4种方式：</b></p>
			<p>四个值：上   右   下   左 padding:0px   0px   0px  40px;</p>
			<p>三个值：上    左右    下 padding:10px   20px   30px ;</p>
			<p>二个值：上下    左右padding:10px   20px  ;</p>
			<p> 一个值：四个方向 padding:2px;/*定义元素四周填充为2px*/</p>
			<p>说明：可单独设置一方向填充，如：上方向padding-top:10px;    右方向padding-right:10px;    下方向padding-bottom:10px;     左方向padding-left:10px;</p>
			</div>
    	</li>        
    	<li>
    		<span className="oos">2、margin的使用方法</span>
            <div className="textcon">
				<p><b>说明：</b></p>
				<p>边界：margin,在元素外边的空白区域，被称为边距。</p>
				<p>margin-left:左边界</p>
				<p>margin-right:右边界</p>
				<p>margin-top:上边界</p>
				<p>margin-bottom:下边界</p>
				<p><b>属性值的4种方式</b>：</p>
				<p> 四个值：上 右 下 左</p>
				<p>三个值：上 左右 下</p>
				<p>二个值：上下 左右</p>
				<p> 一个值：四个方向 margin:2px;/*定义元素四边边界为2px*/</p>
				<p> <em>margin:0 auto;/*一个有宽度的元素在浏览器中横向居中。</em></p>
				<p>定义元素上、下边界为2px，</p>
				<p>说明：可单独设置一方向边界，如：margin-top:10px;</p>
			</div>
    	</li>
    	</ul>
    	<h3>三、盒子的实际大小</h3>
    	<p>宽 =左右margin+左右border+左右padding+width，</p>
		<p>高 =上下margin+上下border+上下padding+height，</p>
		<p>例如：一个盒子的 margin 为 20px，border 为 1px，padding 为 10px，content 的宽为 200px、高为 50px，</p>
		<p>宽=margin*2 + border*2 + padding*2 + content.width = 20*2 + 1*2 + 10*2 +200 = 262px，</p>
		<p>高=margin*2 + border*2 + padding*2 + content.height = 20*2 + 1*2 +10*2 + 50 = 112px，</p>
		<h3>四、文本溢出相关的属性</h3>
		<ul>
			<li>
				<span className="oos">1、溢出属性（容器的）</span>
				<div className="textcon">
					<p><b>说明：</b></p>
					<p><em>overflow:visible/hidden(隐藏)/scrull/auto(自动)/inherit;</em></p>
					<p>visible:默认值，内容不会被修剪，会成现在元素框之外；</p>
					<p>hidden：内容会被修剪，并且其余内容是不可见的；</p>
					<p>scrull：内容会被修剪，但是浏览器会显示滚动条，以便查看其余的内容;</p>
					<p>auto：如果内容被修剪，则浏览器会显示滚动条，以便查看其他的内容;</p>
					<p>inherit：规定应该从父元素继承overflow属性的值。</p>
				</div>
			</li>
			<li>
				<span className="oos">2、空余空间</span>
				<div className="textcon">
					<p><b>说明：</b></p>
					<p><em>white-space：normal/nowrap/pre/pre-wrap /pre-line /inherit该属性用来设置如何处理元素内的空白；</em></p>
					<p>normal：默认值，空白会被浏览器忽略，</p>
					<p>nowrap:文本不会换行，文本会在同一行上继续，直到遇到<br/>标签为止；</p>
					<p>pre：空白会被浏览器保留，其行为方式类似HTML中的pre标签；</p>
					<p>pre-wrap：保留空白符序列，但是正常的进行换行；</p>
					<p>pre-line:合并空白符序列，但是保留换行符；</p>
					<p>inherit：规定应该从父元素继承White-space属性的值；(ie浏览器不支持此属性值)</p>
				</div>
			</li>	
			<li>
				<span className="oos">3、省略号显示</span>
				<div className="textcon">
					<p><b>说明：</b></p>
					<p><em>ext-overflow:clip/ellipsis</em></p>
					<p>clip：不显示省略号（...），而是简单的裁切;</p>
					<p>ellipsis：当对象内文本溢出时，显示省略标记；</p>
					<p>text-overflow属性仅是...，当单行文本溢出时是否显示省略标记，并不具备其它的样式属性定义</p>
					<p className="oos">要实现单行文本溢出时产生省略号的效果还需定义：</p>
					
					<p>1、容器宽度：width：value；</p>
					<p>2、强制文本在一行内显示:white-space：nowrap;</p>
					<p>3、溢出内容为隐藏：overflow：hidden；</p>
					<p>4、溢出文本显示省略号：text-overflow：ellipsis;</p>
				</div>
			</li>
			</ul>

            </div>
        )
    }
}


