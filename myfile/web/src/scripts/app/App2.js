
import React,{Component} from "react";
export default class App2 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div>
                                <div className="boxs">
	<h1>CSS基础</h1>
    <h3>一、CSS简介</h3>
    <div className="marleft">英文全名：cascading  style  sheets(百度百科) === cascading  style  sheet<br/>
      层叠样式表,WEB标准中的表现标准语言,表现标准语言在网页中主要对网页信息的显示进行控制，简单说就是如何修饰网页信息的显示样式。<br/>
      目前推荐遵循的是W3C发布的CSS3.0.<br/>
      用来表现XHTML或者XML等样式文件的计算机语言。<br/>
    1998年5月21日由w3C正式推出的css2.0</div>
    <h3>二、CSS语法</h3>
    <div className="marleft">
      <div>CSS语法：选择符<br/>
      
     <strong className="oo"> 选择符表示要定义样式的对象，可以是元素本身，也可以是一类元素或者制定名称的元素.<br/>
      属性：属性是指定选择符所具有的属性，它是css的核心，css2共有150多个属性<br/>
        属性值：属性值包括法定属性值及常见的数值加单位，如25divx，或颜色值等。<br/></strong>
        说明：<br/>
        1）每个CSS样式由两部分组成，即选择符和声明，声明又分为属性和属性值；<br/>
        2）属性必须放在花括号中，属性与属性值用冒号连接。<br/>
        3）每条声明用分号结束。<br/>
        4）当一个属性有多个属性值的时候，属性值与属性值不分先后顺序。<br/>
        5）在书写样式过程中，空格、换行等操作不影响属性显示。<br/>
      </div>
    </div>
    <h3>三、样式的创建(内部样式   外部样式   内联样式)、两种引入外部样式表的区别</h3>
    <div className="marleft">
      <div>A、内部样式 </div>
      <div className="textcon">
      <div>语法：<br/>
        &lt;style tydive=&quot;text/css&quot;&gt;<br/>
        /*css语句*/<br/>
  &lt;/style&gt;</div>
      <div className="oo"> 注：使用style标记创建样式时，最好将该标记写在&lt;head&gt;&lt;/head&gt;;</div>
    
      </div>
      </div>
      <div>B、外部样式 <br/>
      <div className="textcon">
        *方法一：外部样式表的创建：<br/>
  &lt;link rel=&quot;stylesheet&quot; tydive=&quot;text/css&quot; href=&quot;目标文件的路径及文件名全称&quot; /&gt;<br/>
        说明：<br/>
        使用link元素导入外部样式表时，需将该元素写在文档头部，即&lt;head&gt;与&lt;/head&gt;之间。<br/>
        rel（relation）：用于定义文档关联，表示关联样式表；<br/>
      tydive：定义文档类型；</div></div>
      <div className="textcon">
      <div>*方法二：外部样式表的导入<br/>
        &lt;style tydive=&quot;text/css&quot;&gt;<br/>
@imdivort url(目标文件的路径及文件名全称);<br/>
&lt;/style&gt;<br/>
<strong className="oo">注：@和imdivort之间没有空格 url和小括号之间也没有空格；必须结尾以分号结束；</strong></div></div>
      <div>C、内联样式 （行间样式，行内样式，嵌入式样式）</div>
      <div className="textcon">
      <div>语法：&lt;标签    style=&quot;属性：属性值;属性:属性值;&quot;&gt;&lt;/标签&gt;<br/></div></div>
    </div>
    <h3>四、两种引入外部样式表link和imdivort之间的区别</h3>
    <div className="marleft">
      <div className="other">扩展知识点：link和imdivort导入外部样式的区别：</div>
      <div className="textcon">
      <div><strong className="oo">差别1：本质的差别：</strong>link属于XHTML标签，而@imdivort完全是CSS提供的一种方式。 </div>
      <div><strong className="oo">差别2：加载顺序的差别：</strong>当一个页面被加载的时候（就是被浏览者浏览的时候），link引用的CSS会同时被加载，而@imdivort引用的CSS会等到页面全部被下载完再被加载。所以有时候浏览@imdivort加载CSS的页面时开始会没有样式（就是闪烁），网速慢的时候还挺明显。<br/>
        <strong className="oo">差别3：兼容性的差别：</strong>@imdivort是CSS2.1提出的，所以老的浏览器不支持，@imdivort只有在IE5以上的才能识别，而link标签无此问题。<br/>
     <strong className="oo"> 差别4：使用dom(document  object model文档对象模型 )控制样式时的差别</strong>：当使用javascridivt控制dom去改变样式的时候，只能使用link标签，因为@imdivort不是dom可以控制的.</div>
    </div></div>
    <h3>五、样式表的优先级</h3>
    <div className="marleft">A、内联样式表的优先级别最高<br/>
      B、内部样式表与外部样式表的优先级和书写的顺序有关，后书写的优先级别高。<br/>
    </div>
    <h3>六、CSS选择符（选择器）</h3>
    <div className="marleft">
      <div>常用的选择符有十种左右<br/>
       类型选择符，id选择符，className选择符，通配符，群组选择符<br/>
      包含选择符，伪类选择符(伪类选择符CSS中已经定义好的选择器,不能随便取名)，伪对象选择符(设置在对象后发生的内容。用来和content属性一起使用  )</div>
      <div className="oo oos">1） 元素选择符/类型选择符（element选择器	)</div>
      <div className="textcon">
      <div>语法：元素名称</div>
      <div>说明：</div>
      <div>a)元素选择符就是以文档语言对象类型作为选择符，即使用结构中元素名称作为选择符。例如body、div、div,img,em,strong,sdivan......等。</div>
      <div>b)所有的页面元素都可以作为选择符;</div>
      <div>用法：<br/>
        1)如果想改变某个元素得默认样式时，可以使用类型选择符；<br/>
      （如：改变一个div、div、h1样式）</div>
      <div>2) 当统一文档某个元素的显示效果时，可以使用类型选择符<br/>
      （如：改变文档所有div段落样式）</div>
      </div>
      <div className="oo oos">2) id选择器</div>
      <div className="textcon">
      <div>语法：#id名<br/>
        说明：<br/>
        A）当我们使用id选择符时，应该为每个元素定义一个id属性<br/>
        如：&lt;div id=&quot;div1&quot;&gt;&lt;/div&gt;<br/>
        B）id选择符的语法格式是“#”加上自定义的id名<br/>
      如：#box(width:300divx; height:300divx;)</div>
      <div>C)  起名时要取英文名，不能用关键字：(所有的标记和属性都是关键字)<br/>
        如：head标记<br/>
        D）一个id名称只能对应文档中一个具体的元素对象，因为id只能定义页面中某一个唯一的元素对象。<br/>
      E)   最大的用处：创建网页的外围结构。</div></div>
      <div><strong className="oo oos">3）className选择器</strong><br/>
      <div className="textcon">
        语法：.className名<br/>
        说明：<br/>
        A）当我们使用className选择符时，应先为每个元素定义一个类名称<br/>
        B）className选择符的语法格式是：&quot;如：&lt;div className=&quot;todiv&quot;&gt;&lt;/div&gt;&quot;<br/>
      用法：className选择符更适合定义一类样式；</div></div>
      <div><strong className="oo oos">4)*通配符</strong><br/>
      <div className="textcon">
        语法：*<br/>
        说明：通配选择符的写法是“*”，其含义就是所有元素。<br/>
        用法：常用来重置样式。<br/></div>
       <strong className="oo oos"> 5）群组选择器</strong><br/>
       <div className="textcon">
        语法：选择符1，选择符2，选择符3<br/>
      说明：当有多个选择符应用相同的样式时，可以将选择符用“，”分隔的方式，合并为一组。</div>
      </div>
      <div><strong className="oo oos"> 6） 包含选择器</strong><br/>
      <div className="textcon">
        语法：选择符1    选择符2<br/>
说明：选择符1和选择符2用空格隔开，含义就是选择符1中包含的所有选择符2;<br/>
用法：当我的元素存在父级元素的时候，我要改变自己本身的样式，可以不另加选择符，直接用包含选择器的方式解决。<br/></div>
<strong className="oo oos">7） 伪类选择器(伪类选择符)</strong><br/>
<div className="textcon">
语法 ：<br/>
a:link超链接的初始状态;<br/>
a:visited超链接被访问后的状态;<br/>
a:hover鼠标悬停，即鼠标划过超链接时的状态;<br/>
a:active超链接被激活时的状态，即鼠标按下时超链接的状态;<br/>
<strong className="oo">要让他们遵守一个爱恨原则LoVe/HAte,也就是Link--visited--hover--active。</strong><br/>
说明：<br/>
A）当这4个超链接伪类选择符联合使用时，应注意他们的顺序，正常顺序为：<br/>
a:link,a:visited,a:hover,a:active,错误的顺序有时会使超链接的样式失效；<br/>
B）为了简化代码，可以把伪类选择符中相同的声明提出来放在a选择符中；<br/>
例如：a(color:red;)    a:hover(color:green;) 表示超链接的三种状态都相同，只有鼠标划过变颜色。 <br/></div>
    </div>
    <h3>七、CSS选择符的权重</h3>
    <div className="marleft">css中用四位数字表示权重，权重的表达方式如：0，0，0，0<br/>
      类型选择符的权重为0001<br/>
      className选择符的权重为0010<br/>
      id选择符的权重为0100<br/>
      子选择符的权重为0000<br/>
      属性选择符的权重为0010<br/>
      伪类选择符的权重为0010  <br/>
      伪元素选择符的权重为0010 <br/>
      包含选择符的权重：为包含选择符的权中之和<br/>
      内联样式的权重为1000<br/>
      继承样式的权重为0000
      <div className="textcon">
      <div><strong className="oo">*    当不同选择符的样式设置有冲突的时候，高权重选择
        符的样式会覆盖低权重选择符的样式。</strong></div>
      <div>例如：b    .demo的权重是1+10=11<br/>
        .demo的权重是10<br/>
        所以经常会发生.demo的样式失效</div>
      <div className="oo">*     相同权重的选择符，样式遵循就近原则：哪个选择符最后定义，就采用哪个选择符样式。</div>
      <div className="oo">（注意：是css样式中定义该选择符的先后，而不是html中使用先后）</div>
      <div></div></div>
      <br/>
    </div>
    <h3>八、浮动属性的简单应用</h3>
    <div className="marleft">
    
      <div>语法：float:none/left/right;</div>
      <div>float:定义网页中其它文本如何环绕该元素显示 <br/>
        浮动的目的：就是让竖着的东西横着来 <br/>
        有三个取值：<br/>
        left:元素活动浮动在文本左面<br/>
        right:元素浮动在右面<br/>
        none:默认值，不浮动。<br/>
  </div>
    <h3>九、页面中的注释</h3>
    <div className="marleft">
   	<strong className="other"> 扩展知识点：</strong><br/>
    	Html注释<br/>
      &lt;!-- 我是div的页面注释  --&gt;<br/>
      css的注释<br/>
      /* 我是css的注释  */<br/>
      <br/>
  </div>
</div>

            </div>
            </div>
        )
    }
}