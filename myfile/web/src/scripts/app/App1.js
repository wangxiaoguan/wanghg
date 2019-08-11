
import React,{Component} from "react";
export default class App1 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='app1'> 
                <div className="boxs">
                    <h1>HTML基础</h1>
                    <h3>一、本专业介绍、HTML相关概念，HTML发展历史</h3>
                    <div>本专业介绍</div>
                    <div>移动前端/WEB前端</div>
                    <div>网站建站流程</div>
                    <h3>二、WEB标准，W3C/WHATWG/ECMA相关概念</h3>
                    <div>WEB标准的概念及组成</div>
                    <div>
                        组织解析:<br/>
                        1、W3C( World Wide Web Consortium )万维网联盟，创建于1994年是Web技术领域最具权威和影响力的国际中立性技术标准机构。W3C制定了结构xhtml、xml和表现css的标准。<br/>
                        2、ECMA(European Computer Manufactures Association)欧洲电脑场商联合会。ECMA制定了行为(DOM(文档对象模型)，ECMAScript)标准
                        3、WHATWG网页超文本应用技术工作小组是:以推动网络HTML5标准为目的而成立的组织。在2004年，由Opera、Mozilla基金会和苹果这些浏览器厂商组成。
                    </div>
                    <div>HTML及相关概念的介绍</div>
                    <div>HTML 指的是超文本标记语言 (Hyper Text Markup Language) www万维网的描述性语言。</div>
                    <div>XHTML指可扩展超文本标记语言（标识语言）（EXtensible HyperText Markup Language）是一种置标语言，表现方式与超文本标记语言（HTML）类似，不过语法上更加严格。</div>
                    <div>HTML5指的是HTML的第五次重大修改（第5个版本）(HTML5 是 W3C 与 WHATWG 合作的结果)</div>
                    <div>HTML发展历史</div>
                </div>
                <h3>三、相关软件的应用以及站点的创建</h3>
                      <div>
                          <div><b>1)站点的作用</b><br/>
                              A/ 用来归纳一个网站上所有的网页、素材以及他们之间的联系<br/>
                              B/ 规划网站的所有内容和代码     整合资源<br/>
                              <strong> 2)创建站点的步骤</strong><br/>
                              创建网页所需各个文件夹 css、js、images、html、font<br/>
                              <strong >3)文件的命名规则</strong><br/>
                              A/ 件命名规则：用英文，不用中文<br/>
                              B/ 名称全部用小写英文字母、数字、下划线的组合，其中不得包含汉字、空格和特殊字符；必须以英文字母开头。@#￥%……！   -_<br/>
                              C/ 网站的首页必须命名为index.html不建议使用shouye.html<br/>
                          </div>
                      </div>
                      <h3>四、HTML基本结构和HTML基本语法</h3>
                      <div >
                        <div>HTML基本结构</div>
                      <div><strong>扩展知识点1：</strong></div>
                      <div >
                      <div>HTTP-EQUIV类似于HTTP的头部协议，它回应给浏览器一些有用的信息，以帮助正确和精确地显示网页内容
                        <br/>
                        &lt;!DOCTYPE html PUBLIC &quot;-//W3C//DTD XHTML 1.0 Transitional//EN&quot; http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd&gt;<br/>
                        声明了文档的根元素是 html，它在公共标识符被定义为 &quot;-//W3C//DTD XHTML 1.0 Transitional//EN&quot; 的 DTD(Document Type Definition 文档类型定义) 中进行了定义。浏览器将明白如何寻找匹配此公共标识符的 DTD。如果找不到，浏览器将使用公共标识符后面的 URL 作为寻找 DTD 的位置<br/>
                        另外，需要知道的是，HTML 4.01 规定的三种文档类型、XHTML 1.0 规定的三种<br/>
                  XML 文档类型都是：Strict、Transitional 以及 Frameset。<br/>
                  <strong >定义文档类型  分为四种：Strict（严格型)、Trasitional（过渡型 常用这种）、Frameset（框架型）、手机浏览器DTD mobile</strong><br/>
                  而这句&lt;html xmlns=&quot;http://www.w3.org/1999/xhtml&quot;&gt;，是在文档中的&lt;html&gt; 标签中使用 xmlns 属性，以指定整个文档所使用的主要命名空间。<br/>
                  对于文档声明，了解这些就足够了，现在的html5不再这么繁琐，只需要：<br/>
                  &lt;!DOCTYPE html&gt;<br/>
                  &lt;html&gt;<br/>
                  就可以了。<br/></div></div>
                      </div>
                        <div>HTML的基本语法</div>
                        <div >
                        <div><strong >1、&lt;常规标记&gt;</strong><br/>
                  &lt;标记  属性=“属性值”   属性=“属性值”&gt;&lt;/标记&gt;<br/>
                  例如：&lt;head&gt;&lt;/head&gt;</div>
                  </div>
                  <div >
                        <div><strong >2.空标记</strong><br/>
                    &lt;标记 属性=“属性值”  /&gt;<br/>
                    例如：&lt;meta charset=”utf-8”&gt;
                    &lt;br//&gt;</div>
                    </div>
                        <div><strong>说明：</strong><br/>
                          1.写在&lt;&gt;中的第一个单词叫做标记，标签，元素。<br/>
                          2.标记和属性用空格隔开，属性和属性值用等号连接，属性值必须放在“”号内。<br/>
                          3.一个标记可以没有属性也可以有多个属性，属性和属性之间不分先后顺序。<br/>
                          4.空标记没有结束标签，用“/”代替。<br/>
                        </div>
                        
                      <h3>五、HTML常用标记</h3>
                    <div >
                        <div className="marbtom">1、文本标题（h1-h6）  </div>
                        <div >
                        <div>&lt;h1&gt;一级标题&lt;/h1&gt;<br/>
                          &lt;h2&gt;二级标题&lt;/h2&gt;<br/>
                          &lt;h3&gt;二级标题&lt;/h3&gt;<br/>
                          &lt;h4&gt;二级标题&lt;/h4&gt;<br/>
                          &lt;h5&gt;二级标题&lt;/h5&gt;<br/>
                          &lt;h6&gt;六级标题&lt;/h6&gt;<br/>
                        </div>
                        </div>
                    <div className="marbtom">2、段落文本(p)  </div>
                        <div >
                        <div>&lt;p&gt;段落文本内容&lt;/p&gt;<br/>
                          标识一个段落(段落与段落之间有段间距)</div>
                          </div>
                          
                        <div className="marbtom">3、空格  </div>
                        <div >
                      <div>&amp;nbsp;<br/>
                      所占位置没有一个确定的值,这与当前字体字号都有关系.</div>
                      </div>
                        <div className="marbtom">4、换行(br/) </div>
                        <div >
                        <div>&lt;br/ /&gt;<br/>
                          换行是一个空标记(强制换行)<br/>
                          </div>
                          </div>
                          <strong className="marbtom">5、加粗 加粗有两个标记</strong><br/>
                          <div >
                          A、&lt;b&gt;加粗内容&lt;/b&gt;<br/>
                          B、&lt;strong&gt;加粗内容&lt;/strong&gt;<br/>
                          </div>
                  <strong className="marbtom">6、倾斜<br/></strong>
                  <div >
                  &lt;em&gt;&lt;/em&gt; ,&lt;i&gt;&lt;/i&gt;</div>
                  </div>
                        <div><strong className="marbtom">7、水平线</strong> <div >  &nbsp;&nbsp;&nbsp;&lt;hr /&gt;空标记<br/></div>
                          <strong className="marbtom">8、列表(ul,ol,dl)</strong> 
                          <div >      
                      <div>HTML中有三种列表分别是：无序列表，有序列表，自定义列表<br/>
                        <div >
                  <div >
                          *无序列表<br/>
                          无序列表组成：<br/>
                          &lt;ul&gt;(unordered list)<br/>
                          &lt;li&gt;&lt;/li&gt;<br/>
                          &lt;li&gt;&lt;/li&gt;<br/>
                          ．．．．．．<br/>
                          &lt;/ul&gt;<br/>
                          </div>
                          <div >
                          *有序列表<br/>
                          有序列表组成：<br/>
                          &lt;ol&gt;(ordered list)<br/>
                          &lt;li&gt;&lt;/li&gt;<br/>
                          &lt;li&gt;&lt;/li&gt;<br/>
                          ．．．．．．<br/>
                          &lt;/ol&gt;<br/>
                          </div>
                          <div >
                          *自定义列表<br/>
                          &lt;dl&gt;(definition list)<br/>
                  &lt;dt&gt;名词&lt;/dt&gt;<br/>
                  &lt;dd&gt;解释&lt;/dd&gt;<br/>
                  (definition  description)<br/>
                  ．．．．．．<br/>
                  &lt;/dl&gt;<br/>
                          <br/>
                          </div>        </div>
                          </div></div>
                        <div><strong >知识扩展2----有序列表的属性</strong><br/>
                        <div >
                          1)、type:规定列表中的列表项目的项目符号的类型<br/>
                          语法：&lt;ol type=&quot;a&quot;&gt;&lt;/ol&gt;<br/>
                          1 数字顺序的有序列表（默认值）（1, 2, 3, 4）。<br/>
                          a 字母顺序的有序列表，小写（a, b, c, d）。<br/>
                          A 字母顺序的有序列表，大写（A,B,C,D)<br/>
                          i 罗马数字，小写（i, ii, iii, iv）。<br/>
                          I 罗马数字，大写（I, ii, iii, iv）。<br/>
                          2)、start 属性规定有序列表的开始点。<br/>
                  语法：&lt;ol start=&quot;5&quot;&gt;&lt;/ol&gt;<br/>
                        </div>
                        </div>
                        <div className="marbtom">9、插入图片</div>
                        <div >
                        <div>&lt;img src=&quot;目标文件路径及全称&quot; alt=&quot;图片替换文本&quot; title=&quot;图片标题&quot; /&gt;<br/>
                        <strong > 注:所要插入的图片必须放在站点下</strong><br/>
                          <strong >title的作用: </strong>在你鼠标悬停在该图片上时显示一个小提示，鼠标离开就没有了，HTML的绝大多数标签都支持title属性，title属性就是专门做提示信息的<br/>
                        <strong > alt的作用:</strong>alt属性是在你的图片因为某种原因不能加载时在页面显示的提示信息，它会直接输出在原本加载图片的地方。</div>
                        <div><strong >*相对路径的写法：</strong><br/>
                          1)当当前文件与目标文件在同一目录下，直接书写目标文件文件名+扩展名；&lt;img src=”q12.jpg”/&gt;<br/>
                          2)当当前文件与目标文件所处的文件夹在同一目录下，写法如下：<br/>
                          文件夹名/目标文件全称+扩展名；&lt;img src=”images/q12.jpg”/&gt;<br/>
                          3)当当前文件所处的文件夹和目标文件所处的文件夹在同一目录下，写法如下：<br/>
                          ../目标文件所处文件夹名/目标文件文件名+扩展名；<br/>
                          &lt;img src=”../images/q12.jpg”/&gt;<br/>
                          </div></div>
                          
                      <strong className="marbtom">10、超链接的应用</strong></div>
                      <div >
                        <div>语法：<br/>
                          &lt;a href=&quot;目标文件路径及全称/连接地址&quot; title=&quot;提示文本&quot;&gt;链接文本/图片&lt;/a&gt;<br/>
                          &lt;a href=&quot;#&quot;&gt;&lt;/a&gt;空链接<br/>
                          属性：target:页面打开方式，默认属性值_self。<br/>
                          属性值：<strong >_blank 新窗口打开</strong><br/>
                          &lt;a href=&quot;#&quot; target=&quot;_blank&quot;&gt;新页面打开&lt;/a&gt;<br/>
                        </div>
                        </div>
                        <div className="marbtom"> 11、div和span的用法</div>
                        <div >
                        <div>&lt;div &gt;&lt;/div&gt;</div>
                        <div>没有具体含义，统称为块标签，<br/>
                        用来设置文档区域，是文档布局常用对象</div>
                        <div>&lt;span&gt; &lt;/span&gt;<br/>
                          文本结点标签<br/>
                          可以是某一小段文本，或是某一个字。        <br/>
                        </div>
                        </div>
                        <div className="marbtom">12、数据表格的作用及组成</div>
                        <div >
                        <div >作用：显示数据<br/>  </div>
                        <div>
                          表格组成<br/>
                          &lt;table width=&quot;value&quot; height=&quot;value&quot; border=&quot;value&quot; bgcolor=&quot;value&quot; cellspacing=&quot;value&quot; cellpadding=&quot;value&quot;&gt;<br/>
                          &lt;tr&gt;<br/>
                  &lt;td&gt;&lt;/td&gt;<br/>
                  &lt;td&gt;&lt;/td&gt;<br/>
                  &lt;/tr&gt;<br/>
                  &lt;/table&gt;</div>
                        <div><strong >注：一个tr表示一行;一个td表示一列(一个单元格)</strong><br/>
                          *数据表格的相关属性<br/>
                          1）width=&quot;表格的宽度&quot;<br/>
                          2）height=&quot;表格的高度&quot;<br/>
                          3）border=&quot;表格的边框&quot;<br/>
                          4）bgcolor=&quot;表格的背景色&quot;  bg=background<br/>
                          5）bordercolor=&quot;表格的边框颜色&quot;<br/>
                          6）cellspacing=&quot;单元格与单元格之间的间距&quot;<br/>
                          7）cellpadding=&quot;单元格与内容之间的空隙&quot;<br/>
                          8）对齐方式：align=&quot;left/center/right&quot;;<br/>
                          9)合并单元格属性：<br/>
                        colspan=“所要合并的单元格的列数&quot;合并列;      </div>
                        <div>rowspan=“所要合并单元格的行数”合并行;</div>
                        </div>
                      <div className="marbtom">13、表单的作用及组成</div>
                    <div>表单的作用：用来收集用户的信息的;</div>
                    <div>1)、表单框<br/>
                          <div >

                      &lt;form name=&quot;表单名称&quot; method=&quot;post/get&quot;  action=&quot;&quot;&gt;&lt;/form&gt;<br/>
                        </div>
                      2）文本框<br/>
                            <div >

                      &lt;input type=&quot;text&quot; value=&quot;默认值&quot;/&gt;<br/></div>
                      3)密码框<br/>
                        <div >
                      &lt;input type=&quot;password&quot; /&gt;<br/>
                      &lt;input type=&quot;password&quot; placeholder=&quot;密码&quot; /&gt;</div></div>
                    <div>4)重置按钮<br/>
                      <div >
                      &lt;input type=&quot;reset&quot; value=&quot;按钮内容&quot; /&gt;<br/></div>
                      5）单选框/单选按钮<br/>
                        <div >
                      &lt;input type=&quot;radio&quot; name=&quot;ral&quot; /&gt;<br/>
                      &lt;input type=&quot;radio&quot; name=&quot;ral&quot; checked=&quot;checked&quot; /&gt;<br/>
                      单选按钮里的name属性必须写，同一组单选按钮的name属性值必须一样。<br/>
                      checked=&quot;checked&quot;(默认选中；)  disabled=&quot;disabled&quot;禁用</div></div>
                    <div>6）复选框<br/>
                      <div >
                      &lt;input type=&quot;checkbox&quot; name=&quot;like&quot; /&gt;<br/>
                      &lt;input type=&quot;checkbox&quot; name=&quot;like&quot; disabled=&quot;disabled&quot; /&gt; (disabled=&quot;disabled&quot; :禁用)<br/>
                      (checked=&quot;checked&quot; :默认选中)</div></div>
                    <div> 7)下拉菜单<br/>
                      <div >
                      &lt;select    name=&quot;&quot;&gt;<br/>
                  &lt;option&gt;菜单内容&lt;/option&gt;<br/>
                  &lt;/select&gt;<br/></div>
                  8）多行文本框（文本域）<br/>
                  <div >
                  &lt;textarea name=&quot;textareal&quot; cols=&quot;字符宽度&quot; rows=&quot;行数&quot;&gt;<br/>
                  &lt;/textarea&gt;<br/></div>
                  9)按钮<br/>
                  <div >
                  &lt;input   name=&quot;'&quot;   type=&quot;button&quot; value=“按钮内容” /&gt;<br/>
                  &lt;input   name=&quot;'&quot;   type=&quot;submit&quot; value=“按钮内容” /&gt;<br/>
                  &lt;button&gt;&lt;/button&gt;</div></div>
                    <div >button和submit的区别是：<br/>
                      <div >
                      submit是提交按钮起到提交信息的作用，type类型是button只起到跳转的作用，不进行提交。</div></div>
                    <div ><strong>扩展知识点3：对于不同的输入类型，value 属性的用法的意义</strong></div>
                      <div >
                      <div>value 属性为 input 元素设定值。<br/>
                        对于不同的输入类型，value 属性的用法也不同：<br/>
                        type=&quot;button&quot;, &quot;reset&quot;, &quot;submit&quot; - 定义按钮上的显示的文本<br/>
                        type=&quot;text&quot;, &quot;password&quot; - 定义输入字段的初始值<br/>
                        type=&quot;checkbox&quot;, &quot;radio&quot; - 定义与输入相关联的值<br/>
                        注释：&lt;input type=&quot;checkbox&quot;&gt; 和 &lt;input type=&quot;radio&quot;&gt; 中必须设置 value 属性。<br/>
                      </div></div>
                        <div ><strong>扩展知识点4：</strong></div>
                        <div >
                        <div >&lt;form name=&quot;表单名称&quot; method=&quot;post/get&quot;  action=&quot;&quot;&gt;&lt;/form&gt;</div>
                        <div >Form中的获取数据的两个方式get和post的区别？</div>
                        <div >1. get是从服务器上获取数据，post是向服务器传送数据。<br/>
                          2. get是把参数数据队列加到提交表单的ACTION属性所指的URL中，值和表单内各个字段一一对应，在URL中可以看到。post是通过HTTP post机制，将表单内各个字段与其内容放置在HTML HEADER内一起传送到ACTION属性所指的URL地址。用户看不到这个过程。<br/>
                          3. 对于get方式，服务器端用Request.QueryString获取变量的值，对于post方式，服务器端用Request.Form获取提交的数据。<br/>
                          4. get传送的数据量较小，不能大于2KB。post传送的数据量较大，一般被默认为不受限制。<br/>
                          5. get安全性非常低，post安全性较高。但是执行效率却比Post方法好。<br/>
                          建议：<br/>
                        1、get方式的安全性较Post方式要差些，包含机密信息的话，建议用Post数据提交方式；</div>
                        <div>2、在做数据查询时，建议用Get方式；而在做数据添加、修改或删除时，建议用Post方式；<br/></div></div>
  	  </div>
    
        )
    }
}


