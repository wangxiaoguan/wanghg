
import React,{Component} from "react";
import './app.scss'
export default class App8 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app8'>
<span>document.execCommand()方法处理Html数据时常用语法格式如下:</span><br/>
                <span>document.execCommand(sCommand[,交互方式, 动态参数])</span><br/>
                <span>其中：sCommand为指令参数（如下例中的”2D-Position”），交互方式参数如果是true的话将显示对话框，如果为false的话，则不显示对话框（下例中的”false”即表示不显示对话框），动态参数一般为一可用值或属性值（如下例中的”true”）。</span><br/>
                <span>document.execCommand(”2D-Position”,”false”,”true”);</span><br/>
                <span>调用execCommand()可以实现浏览器菜单的很多功能. 如保存文件,打开新文件,撤消、重做操作…等等. 有了这个方法,就可以很容易的实现网页中的文本编辑器.</span><br/>
                <span>如果灵活运用,可以很好的辅助我们完成各种项目.</span><br/>
                <span>使用的例子如下:</span><br/>
                <span>1、〖全选〗命令的实现</span><br/>
                <span>[格式]:document.execCommand(”selectAll”)</span><br/>
                <span>[说明]将选种网页中的全部内容！</span><br/>
                <span>[举例]在之间加入：</span><br/>
                <span>全选</span><br/>
                <span>2、〖打开〗命令的实现</span><br/>
                <span>[格式]:document.execCommand(”open”)</span><br/>
                <span>[说明]这跟VB等编程设计中的webbrowser控件中的命令有些相似，大家也可依此琢磨琢磨。</span><br/>
                <span>[举例]在之间加入：</span><br/>
                <span>打开</span><br/>
                <span>3、〖另存为〗命令的实现</span><br/>
                <span>[格式]:document.execCommand(”saveAs”)</span><br/>
                <span>[说明]将该网页保存到本地盘的其它目录！</span><br/>
                <span>[举例]在之间加入：</span><br/>
                <span>另存为</span><br/>
                <span>4、〖打印〗命令的实现</span><br/>
                <span>[格式]:document.execCommand(”print”)</span><br/>
                <span>[说明]当然，你必须装了打印机！</span><br/>
                <span>[举例]在之间加入：</span><br/>
                <span>打印</span><br/>
                <span>Js代码 下面列出的是指令参数及意义</span><br/>
                <span>//相当于单击文件中的打开按钮</span><br/>
                <span>document.execCommand(”Open”);</span><br/>
                <span>//将当前页面另存为</span><br/>
                <span>document.execCommand(”SaveAs”);</span><br/>
                <span>//剪贴选中的文字到剪贴板;</span><br/>
                <span>document.execCommand(”Cut”,”false”,null);</span><br/>
                <span>//删除选中的文字;</span><br/>
                <span>document.execCommand(”Delete”,”false”,null);</span><br/>
                <span>//改变选中区域的字体;</span><br/>
                <span>document.execCommand(”FontName”,”false”,sFontName);</span><br/>
                <span>//改变选中区域的字体大小;</span><br/>
                <span>document.execCommand(”FontSize”,”false”,sSize|iSize);</span><br/>
                <span>//设置前景颜色;</span><br/>
                <span>document.execCommand(”ForeColor”,”false”,sColor);</span><br/>
                <span>//使绝对定位的对象可直接拖动;</span><br/>
                <span>document.execCommand(”2D-Position”,”false”,”true”);</span><br/>
                <span>//使对象定位变成绝对定位;</span><br/>
                <span>document.execCommand(”AbsolutePosition”,”false”,”true”);</span><br/>
                <span>//设置背景颜色;</span><br/>
                <span>document.execCommand(”BackColor”,”false”,sColor);</span><br/>
                <span>//使选中区域的文字加粗;</span><br/>
                <span>document.execCommand(”Bold”,”false”,null);</span><br/>
                <span>//复制选中的文字到剪贴板;</span><br/>
                <span>document.execCommand(”Copy”,”false”,null);</span><br/>
                <span>//设置指定锚点为书签;</span><br/>
                <span>document.execCommand(”CreateBookmark”,”false”,sAnchorName);</span><br/>
                <span>//将选中文本变成超连接,若第二个参数为true,会出现参数设置对话框;</span><br/>
                <span>document.execCommand(”CreateLink”,”false”,sLinkURL);</span><br/>
                <span>//设置当前块的标签名;</span><br/>
                <span>document.execCommand(”FormatBlock”,”false”,sTagName);</span><br/>
                <span>//相当于单击文件中的打开按钮</span><br/>
                <span>document.execCommand(”Open”);</span><br/>
                <span>//将当前页面另存为</span><br/>
                <span>document.execCommand(”SaveAs”);</span><br/>
                <span>//剪贴选中的文字到剪贴板;</span><br/>
                <span>document.execCommand(”Cut”,”false”,null);</span><br/>
                <span>//删除选中的文字;</span><br/>
                <span>document.execCommand(”Delete”,”false”,null);</span><br/>
                <span>//改变选中区域的字体;</span><br/>
                <span>document.execCommand(”FontName”,”false”,sFontName);</span><br/>
                <span>//改变选中区域的字体大小;</span><br/>
                <span>document.execCommand(”FontSize”,”false”,sSize|iSize);</span><br/>
                <span>//设置前景颜色;</span><br/>
                <span>document.execCommand(”ForeColor”,”false”,sColor);</span><br/>
                <span>//使绝对定位的对象可直接拖动;</span><br/>
                <span>document.execCommand(”2D-Position”,”false”,”true”);</span><br/>
                <span>//使对象定位变成绝对定位;</span><br/>
                <span>document.execCommand(”AbsolutePosition”,”false”,”true”);</span><br/>
                <span>//设置背景颜色;</span><br/>
                <span>document.execCommand(”BackColor”,”false”,sColor);</span><br/>
                <span>//使选中区域的文字加粗;</span><br/>
                <span>document.execCommand(”Bold”,”false”,null);</span><br/>
                <span>//复制选中的文字到剪贴板;</span><br/>
                <span>document.execCommand(”Copy”,”false”,null);</span><br/>
                <span>//设置指定锚点为书签;</span><br/>
                <span>document.execCommand(”CreateBookmark”,”false”,sAnchorName);</span><br/>
                <span>//将选中文本变成超连接,若第二个参数为true,会出现参数设置对话框;</span><br/>
                <span>document.execCommand(”CreateLink”,”false”,sLinkURL);</span><br/>
                <span>//设置当前块的标签名;</span><br/>
                <span>document.execCommand(”FormatBlock”,”false”,sTagName);</span><br/>
                <span>document对象execCommand通常在IE中在线处理Html数据时非常有用，它可以让你轻而易举实现文字的加粗、加颜色、加字体等一系列的命令。</span><br/>
                <span>D-Position 允许通过拖曳移动绝对定位的对象。</span><br/>
                <span>AbsolutePosition 设定元素的 position 属性为“absolute”(绝对)。</span><br/>
                <span>BackColor 设置或获取当前选中区的背景颜色。</span><br/>
                <span>BlockDirLTR 目前尚未支持。</span><br/><span>BlockDirRTL 目前尚未支持。</span><br/>
                <span>Bold 切换当前选中区的粗体显示与否。</span><br/>
                <span>BrowseMode 目前尚未支持。</span><br/>
                <span>Copy 将当前选中区复制到剪贴板。</span><br/>
                <span>CreateBookmark 创建一个书签锚或获取当前选中区或插入点的书签锚的名称。</span><br/>
                <span>CreateLink 在当前选中区上插入超级链接，或显示一个对话框允许用户指定要为当前选中区插入的超级链接的 URL。</span><br/>
                <span>Cut 将当前选中区复制到剪贴板并删除之。</span><br/>
                <span>Delete 删除当前选中区。</span><br/>
                <span>DirLTR 目前尚未支持。</span><br/>
                <span>DirRTL 目前尚未支持。</span><br/>
                <span>EditMode 目前尚未支持。</span><br/>
                <span>FontName 设置或获取当前选中区的字体。</span><br/>
                <span>FontSize 设置或获取当前选中区的字体大小。</span><br/>
                <span>ForeColor 设置或获取当前选中区的前景(文本)颜色。</span><br/>
                <span>FormatBlock 设置当前块格式化标签。</span><br/>
                <span>Indent 增加选中文本的缩进。</span><br/>
                <span>InlineDirLTR 目前尚未支持。</span><br/>
                <span>InlineDirRTL 目前尚未支持。</span><br/>
                <span>InsertButton 用按钮控件覆盖当前选中区。</span><br/>
                <span>InsertFieldset 用方框覆盖当前选中区。</span><br/>
                <span>InsertHorizontalRule 用水平线覆盖当前选中区。</span><br/>
                <span>InsertIFrame 用内嵌框架覆盖当前选中区。</span><br/>
                <span>InsertImage 用图像覆盖当前选中区。</span><br/>
                <span>InsertInputButton 用按钮控件覆盖当前选中区。</span><br/>
                <span>InsertInputCheckbox 用复选框控件覆盖当前选中区。</span><br/>
                <span>InsertInputFileUpload 用文件上载控件覆盖当前选中区。</span><br/>
                <span>InsertInputHidden 插入隐藏控件覆盖当前选中区。</span><br/>
                <span>InsertInputImage 用图像控件覆盖当前选中区。</span><br/>
                <span>InsertInputPassword 用密码控件覆盖当前选中区。</span><br/>
                <span>InsertInputRadio 用单选钮控件覆盖当前选中区。</span><br/>
                <span>InsertInputReset 用重置控件覆盖当前选中区。</span><br/>
                <span>InsertInputSubmit 用提交控件覆盖当前选中区。</span><br/>
                <span>InsertInputText 用文本控件覆盖当前选中区。</span><br/>
                <span>InsertMarquee 用空字幕覆盖当前选中区。</span><br/>
                <span>InsertOrderedList 切换当前选中区是编号列表还是常规格式化块。</span><br/>
                <span>InsertParagraph 用换行覆盖当前选中区。</span><br/>
                <span>InsertSelectDropdown 用下拉框控件覆盖当前选中区。</span><br/>
                <span>InsertSelectListbox 用列表框控件覆盖当前选中区。</span><br/>
                <span>InsertTextArea 用多行文本输入控件覆盖当前选中区。</span><br/>
                <span>InsertUnorderedList 切换当前选中区是项目符号列表还是常规格式化块。</span><br/>
                <span>Italic 切换当前选中区斜体显示与否。</span><br/>
                <span>JustifyCenter 将当前选中区在所在格式化块置中。</span><br/>
                <span>JustifyFull 目前尚未支持。</span><br/>
                <span>JustifyLeft 将当前选中区所在格式化块左对齐。</span><br/>
                <span>JustifyNone 目前尚未支持。</span><br/>
                <span>JustifyRight 将当前选中区所在格式化块右对齐。</span><br/>
                <span>LiveResize 迫使 MSHTML 编辑器在缩放或移动过程中持续更新元素外观，而不是只在移动或缩放完成后更新。</span><br/>
                <span>MultipleSelection 允许当用户按住 Shift 或 Ctrl 键时一次选中多于一个站点可选元素。</span><br/>
                <span>Open 目前尚未支持。</span><br/>
                <span>Outdent 减少选中区所在格式化块的缩进。</span><br/>
                <span>OverWrite 切换文本状态的插入和覆盖。</span><br/>
                <span>Paste 用剪贴板内容覆盖当前选中区。</span><br/>
                <span>PlayImage 目前尚未支持。</span><br/>
                <span>Print 打开打印对话框以便用户可以打印当前页。</span><br/>
                <span>Redo 目前尚未支持。</span><br/>
                <span>Refresh 刷新当前文档。</span><br/>
                <span>RemoveFormat 从当前选中区中删除格式化标签。</span><br/>
                <span>RemoveParaFormat 目前尚未支持。</span><br/>
                <span>SaveAs 将当前 Web 页面保存为文件。</span><br/>
                <span>SelectAll 选中整个文档。</span><br/>
                <span>SizeToControl 目前尚未支持。</span><br/>
                <span>SizeToControlHeight 目前尚未支持。</span><br/>
                <span>SizeToControlWidth 目前尚未支持。</span><br/>
                <span>Stop 目前尚未支持。</span><br/>
                <span>StopImage 目前尚未支持。</span><br/>
                <span>StrikeThrough 目前尚未支持。</span><br/>
                <span>Subscript 目前尚未支持。</span><br/>
                <span>Superscript 目前尚未支持。</span><br/>
                <span>UnBookmark 从当前选中区中删除全部书签。</span><br/>
                <span>Underline 切换当前选中区的下划线显示与否。</span><br/>
                <span>Undo 目前尚未支持。</span><br/>
                <span>Unlink 从当前选中区中删除全部超级链接。</span><br/>
                <span>Unselect 清除当前选中区的选中状态。</span><br/>
                <span>关于document.execCommand：</span><br/>
                <span>要执行编辑命令，可调用 document.execCommand，并传递对应于命令 ID 的字符串。另外还有可选的第二个参数，该参数指定如果可以应用的话是否显示此命令的用户界面。传递整数 1 将显示用户界面，整数 0 将跳过它。这个参数通常不用于编辑命令。因为默认值为
                 0，所以假如您没有使用第三个参数（在这种情况下，还必须为第二个参数传递值），一般可以不管它。第三个参数也是可选的，在可应用的情况下，使用它来将任何所需参数传递给该命令。</span><br/>
            
            </div>
        )
    }
}


