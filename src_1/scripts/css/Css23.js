
import React,{Component} from "react";
import {Button,Icon,Input,Select} from 'antd'
const Option = Select.Option;
import './css.scss'
export default class Css23 extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
      
    }

    render(){
        return(
            <div id='css23'> 
<pre>{`
<table width="1000"  height="600"  bgcolor="#CC0000" background="1.jpg"
    border="5"  bordercolor="red" cellpadding="5" cellspacing="10">
        <!--width表格宽度,height表格高度-->
        <!--bgcolor表格背景颜色-->
        <!--background表格背景图片地址，优先级高于bgcolor-->
        <!--border表格边框宽度-->
        <!--bordercolor表格边框颜色-->
        <!--cellpadding表格内边距（单元格边框与内容间距离）-->
        <!--cellspacing表格外边距（单元格之间距离）-->
    <tr>
        <td   colspan="6"  align="center">表格主数据</td><!-- 创建1行1列-->
        <td   rowspan="4"  align="center">表格主数据</td><!-- 创建1行2列 -->
    </tr>
    <!--rowspan行合并-->
    <!--colspan列合并-->
    <!--align表格里数据排列对齐方式-->

    <tr  align="right" bgcolor="green"  valign="middle"  ><!--创建2行共六列-->
        <th>第一单元格</th><!--th表示字体加粗-->
        <td>第二单元格</td>
        <td>第三单元格</td>
        <td>第四单元格</td>
        <td>第五单元格</td>
        <td>第六单元格</td>
    </tr>
    <tr  align="center"><!--创建3行共六列-->
        <th>第一单元格</th>
        <td>第二单元格</td>
        <td>第三单元格</td>
        <td>第四单元格</td>
        <td>第五单元格</td>
        <td>第六单元格</td>
    </tr>
        <tr align="left"><!--创建4行共六列-->
        <th>第一单元格</th>
        <td>第二单元格</td>
        <td>第三单元格</td>
        <td>第四单元格</td>
        <td>第五单元格</td>
        <td>第六单元格</td>
    </tr>
</table>
`}</pre>
            </div>
    
        )
    }
}


