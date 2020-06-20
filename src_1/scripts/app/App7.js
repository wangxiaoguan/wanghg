
import React,{Component} from "react";

export default class App7 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='app7'>
<pre>{`使用该meta标签时，在content中写属性，用逗号隔开
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0" />
`}</pre>

<table>
<thead>
<tr>
  <th align="center">属性名</th>
  <th align="center">备注</th>
</tr>
</thead>
<tbody><tr>
  <td align="center">width</td>
  <td align="center">设置layout viewport  的宽度，为一个正整数，使用字符串”width-device”表示设备宽度</td>
</tr>
<tr>
  <td align="center">initial-scale</td>
  <td align="center">设置页面的初始缩放值，为一个数字，可以带小数</td>
</tr>
<tr>
  <td align="center">minimum-scale</td>
  <td align="center">允许用户的最小缩放值，为一个数字，可以带小数</td>
</tr>
<tr>
  <td align="center">maximum-scale</td>
  <td align="center">允许用户的最大缩放值，为一个数字，可以带小数</td>
</tr>
<tr>
  <td align="center">height</td>
  <td align="center">设置layout viewport  的高度，这个属性对我们并不重要，很少使用</td>
</tr>
<tr>
  <td align="center">user-scalable</td>
  <td align="center">是否允许用户进行缩放，值为”no”或”yes”, no 代表不允许，yes代表允许</td>
</tr>
<tr>
  <td align="center">target-densitydpi</td>
  <td align="center">值可以为一个数值或 high-dpi 、 medium-dpi、 low-dpi、 device-dpi 这几个字符串中的一个</td>
</tr>
</tbody></table>

            </div>
        )
    }
}


