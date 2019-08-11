
import React,{Component} from "react";

export default class App3 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div>
                <div className="boxs">
	<h1>CSS核心属性</h1>
    <h3>一、css浮动属性详解</h3>
    <div className="marleft">
    	<div>首先要知道，div是块级元素，在页面中独占一行，自上而下排列，也就是传说中的流<br/>
        </div>
    	<div>可以看出，即使div1的宽度很小，页面中一行可以容下div1和div2，div2也不会排在div1后边，因为div元素是独占一行的<br/>
            <div className="textcon">

    	  <strong className="oo">注意，以上这些理论，是指标准流中的div。</strong><br/>
    	  无论多么复杂的布局，<strong className="oo">其基本出发点均是：“如何在一行显示多个div元素”。</strong><br/>
    	  显然标准流已经无法满足需求，这就要用到浮动。<br/>
    	  浮动可以理解为让某个div元素脱离标准流，漂浮在标准流之上，和标准流不是一个层次。<br/>
    	</div>
        </div>
        <div className="textcon">
    	<div><strong className="oo">浮动规律：</strong>假如某个div元素A是浮动的，如果A元素上一个元素也是浮动的，那么A元素会跟随在上一个元素的后边(如果一行放不下这两个元素，那么A元素会被挤到下一行)；如果A元素上一个元素是标准流中的元素，那么A的相对垂直位置不会改变，也就是说A的顶部总是和上一个元素的底部对齐。<br/>
    	  div的顺序是HTML代码中div的顺序决定的。<br/>
    	  靠近页面边缘的一端是前，远离页面边缘的一端是后。<br/></div></div>
    	</div>
    	<div>元素浮动之前，也就是在标准流中，是竖向排列的，而浮动之后可以理解为横向排列<br/>
    	  清除浮动可以理解为打破横向排列。<br/>
    	  清除浮动的关键字是clear，语法：<br/>
    	  clear : none | left | right | both<br/>
    	  none  :  默认值。允许两边都可以有浮动对象<br/>
    	  left   :  不允许左边有浮动对象<br/>
    	  right  :  不允许右边有浮动对象<br/>
   	    both  :  不允许有浮动对象</div>
    <div className="textcon">	<div><strong className="oo">对于CSS的清除浮动(clear)，一定要牢记：这个规则只能影响使用清除的元素本身，不能影响其他元素。</strong>
  	  </div></div>
    </div>
    <h3>二、css文本属性</h3>
    <div className="marleft">
      <div className="oo oos">1）文本大小：font-size:value;</div>
      <div className="textcon">
      <div>说明：<br/>
        A） 属性值为数值型时，必须给属性值加单位，属性值为0时除外。<br/>
        B）单位还可以是pt，9pt=12px;<br/>
      C）为了减小系统间的字体显示差异，IE Netscape Mozilla的浏览器制作商于1999年召开会议，共同确定16px/ppi为标准字体大小默认值,即1em.默认情况下，1em=16px,0.75em=12px;        </div>
      <div>D)使用绝对大小关键字<br/>
        xx-small   =9px<br/>
        x-small    =11px<br/>
        small      =13px<br/>
        medium     =16px<br/>
        large      =19px<br/>
        x-large    =23px<br/>
        xx-large   =27px<br/>
        </div></div>
        <strong className="oo oos">2）文本颜色：color:颜色值;</strong><br/>
        <div className="textcon">
        说明：<br/>
        用十六进制(是计算机中数据的一种表示方法)表示颜色值：<br/>
        0  1  2  3  4   5  6  7  8  9<br/>
        0  1  2  3  4   5  6  7  8  9  A  B  C  D  E  F<br/>
        颜色模式：光色模式<br/>
R      G      B<br/>
FF      00     00<br/>
颜色值的缩写：<br/>
当表示三原色的三组数字同时相同时，可以缩写为三位;<br/>
当用十六进制表示颜色值时，需要在颜色值前加“#”<br/>
#  fa   00    00<br/>
</div>
<strong className="oo oos">3)文本字体：font-family:字体1，字体2，字体3；</strong><br/>
<div className="textcon">
说明：浏览器首先会寻找字体1、如存在就使用改字体来显示内容，如在字体1不存在的情况下，则会寻找字体2，如字体2也不存在，按字体3显示内容，如果字体3 也不存在；则按系统默认字体显示； <br/>
当字体是中文字体时，需加双引号；<br/>
当英文字体中有空格时，需加双引号如（“Times New Roman”）<br/>
当英文字体只有一个单词组成是不加双引号；如：（Arial）；<br/>
Windows中文版本操作系统下，中文默认字体为宋体或者新宋体，英文字体默认为Arial.<br/>
</div>
<strong className="oo oos">4)文字加粗</strong><br/>
<div className="textcon">
font-weight:bolder(更粗的)/bold（加粗）/normal（常规）/100—900;<br/>
说明：在css规范中，把字体的粗细分为9个等级，分别为100——900，其中100对应最轻的字体变形，而900对应最重的字体变形，<br/>
100-400 一般<br/>
500常规字体<br/>
600-900加粗字体 <br/>
</div>
<strong className="oo oos">5)文字倾斜</strong><br/>
<div className="textcon">
font-style：italic/oblique/normal（取消倾斜，常规显示）;<br/>
说明：<br/>
italic和oblique都是向右倾斜的文字, 但区别在于Italic是指斜体字，而Oblique是倾斜的文字，对于没有斜体的字体应该使用Oblique属性值来实现倾斜的文字效果.<br/>
</div>
<strong className="oo oos">6)水平对齐方式</strong><br/>
<div className="textcon">
text-align:left/right/center/justify（两端对齐中文不起作用）;<br/>
</div>
<strong className="oo oos">7)文字行高 line-height:normal/value;</strong></div>
<div className="textcon">
      <div>说明：<br/>
        A）当单行文本的行高等于容器高时，可实现单行文本在容器中垂直方向居中对齐；<br/>
      B)   当单行文本的行高小于容器高时，可实现单行文本在容器中垂直中齐以上任意位置的定位；</div>
      <div></div>
      <div>C)   当单行文本的行高大于容器高时，可实现单行文本在容器中垂直中齐以下任意位置的定位。（IE6及以下版本存在浏览器兼容问题）</div>
      </div>
      <div className="textcon">
      <div><strong className="oo">*文字属性简写：font:12px/24px  &quot;宋体&quot;;</strong><br/>
        font属性的简写：字号，行高，字体<br/>
        font-size:12px; line-height:24px; font-family:”宋体”；<br/>
        font属性的简写：<br/>
        说明:font的属性值应按以下次序书写(各个属性之间用空格隔开)<br/>
      顺序: font-style  font-weight  font-size / line-height  font-family<br/>
      (1)简写时 , font-size和line-height只能通过斜杠/组成一个值，不能分开写。<br/>
      (2) 顺序不能改变 ,这种简写法只有在同时指定font-size和font-family属性时才起作用,而且,你没有设定font-weight , font-style , 他们会使用缺省值（默认值）。<br/>
      </div>
      </div>
      <div className="oo oos">8)文本修饰</div>
      <div className="textcon">
      <div>text-decoration:none/underline/overline/line-through<br/>
        说明：<br/>
        none:没有修饰<br/>
        underline:添加下划线<br/>
        overline:添加上划线<br/>
      line-through:添加删除线</div>
      </div>
      <div className="oo oos">9)首行缩进：text-indent:value;</div>
      <div className="textcon">
      <div>说明：首行缩进2个字 text-indent:2em;<br/>
        A）text-indent可以取负值；<br/>
        B）text-indent属性只对第一行起作用。<br/>
      </div>
      </div>
      <div className="oo oos">10)字间距letter-spacing:value;</div>
      <div className="textcon">
      <div>控制英文字母或汉字的字距。（英文字母和字母）
        <br/>
      </div>
    </div>
    
    <h3>三、css列表属性</h3>
    <div className="marleft">
      <div className="oo oos">1)定义列表符号样式</div>
      <div className="textcon"><div>list-style-type：disc(实心圆)/circle(空心圆)/square(实心方块)/none(去掉列表符号)；list-style-type:none===list-style:none;</div></div>
      <div><strong className="oo oos">2)使用图片作为列表符号</strong><br/>
      <div className="textcon">
        list-style-image：url(所使用图片的路径及全称)；<br/></div>
        <strong className="oo oos">3)定义列表符号的位置</strong><br/>
        <div className="textcon">
      list-style-position:outside(外边)/inside(里边)；</div>
      <div>list-style:none;去掉列表符号 <br/>
      </div>
      </div>
    </div>
    <h3>四、css背景属性</h3>
    <div className="marleft">
    <strong className="oo oos">1)背景颜色</strong><br/>
    <div className="textcon">语法：选择符background-color:颜色值;<br/></div>
   <strong className="oo oos"> 2)背景图片的设置</strong><br/>
    <div className="textcon"><div>语法：background-image：url(背景图片的路径及全称)；</div>
    <div>说明：<br/>
      <strong className="oo oos">网页上有两种图片形式：插入图片、背景图；</strong><br/>
      插入图片：属于网页内容，也就是结构。<br/>
      背景图：属于网页的表现，背景图上可以显示文字、插入图片、表格等。</div>
    <div className="oo">背景图片的显示原则:</div>
    <div>A）容器尺寸等于图片尺寸，背景图片正好显示在容器中<br/>
B）容器尺寸大于图片尺寸，背景图片将默认平铺，直至铺满元素；<br/>
C）容器尺寸小于图片尺寸，只显示元素范围以内的背景图。</div></div>
    <div><strong className="oo oos">3)背景图片平铺属性</strong><br/>
    <div className="textcon">
      语法：选择符background-repeat:no-repeat/repeat/repeat-x/repeat-y <br/>
      no-repeat:不平铺<br/>
      repeat：平铺<br/>
      repeat-x：横向平铺<br/>
      repeat-y ：纵向平铺<br/>
      </div>
     <strong className="oo oos"> 4)背景图的固定</strong><br/>
     <div className="textcon">
      语法：<br/>
      选择符background-attachment:scroll(滚动)/fixed(固定);</div>
    <div>说明：<br/>
      fixed 固定，不随内容一块滚动；<br/>
      scroll:随内容一块滚动。<br/>
    </div>
    </div>
    <div> <strong className="oo oos"> 5)背景图片的位置</strong><br/>
    <div className="textcon">
      语法：选择符<br/>
      background-position:left/center/right/数值  top/center/bottom/数值;</div>
    <div> 水平方向上的对齐方式（left/center/right）或值 <br/>
      垂直方向上的对齐方式(top/center/bottom)或值</div>
    <div>background-position:值1    值2;<br/>
      两个值 ：第一个值表示水平位置的值，第二个值：表示垂直的位置。<br/>
      当两个值都是center的时候写一个值就可以代表的是水平位置和垂直位置<br/>
      说明：向左方向，向上方向是负值<br/>
      </div></div>
      <div className="textcon">
      背景属性的缩写语法：<br/>
      background:属性值1   属性值2   属性值3；<br/>
      背景缩写：background:url（背景图片的路径及全称） no-repeat center top #f00；<br/></div>
     <strong className="oo"> 网页上常用的图片格式（压缩图片）</strong><br/>
     <div className="textcon">
      1)jpg :有损压缩格式，靠损失图片本身的质量来减小图片的体积，适用于颜色丰富的图像;(像素点组成的，像素点越多会越清晰 )如果网页中<br/>
      2）gif：有损压缩格式，靠损失图片的色彩数量来减小图片的体积，支持透明，支持动画，适用于颜色数量较少的图像;<br/>
      3)png:有损压缩格式，损失图片的色彩数量来减小图片的体积，支持透明，不支持动画，是fireworks的 源文件格式，适用于颜色数量较少的图像;<br/>
    </div>
   </div>
   
    <h3>五、css边框属性</h3>
    <div className="marleft">
      <div>border:边框宽度 边框风格 边框颜色;<br/>
        例如：border:5px solid #ff0000<br/>
        边框：border,网页中很多修饰性线条都是由边框来实现的。<br/>
        边框宽度：border-width:<br/>
        边框颜色：border-color:<br/>
       <strong className="oo"> 边框样式：border-style:solid(实线)/dashed(虚线)dotted(点划线)double(双线)可单独设置一方向边框，</strong></div>
      <div>border-bottom:边框宽度 边框风格 边框颜色;底边框<br/>
        border-left:边框宽度 边框风格 边框颜色;左边框<br/>
        border-right:边框宽度 边框风格 边框颜色;右边框<br/>
        border-top:边框宽度 边框风格 边框颜色;上边框<br/>
      </div>
      </div>
    
    </div>
            
        )
    }
}


