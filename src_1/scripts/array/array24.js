
import React,{Component} from "react";
import './array.scss'
export default class Array24 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array24'>
<pre>{`
    $(document).ready(function(){   });
    当 DOM（文档对象模型） 已经加载，并且页面（包括图像）已经完全呈现时，会发生 ready 事件。

    获取URL的查询参数
    const url = '?page=info&type=3&orderId=1&Id=363503'
    let object = {}
    // location.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => object[k] = v)
    url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => object[k] = v)
    console.log(object)     //{page: "info", type: "3", orderId: "1", Id: "363503"}

    生成随机ID
    const codeId = Math.random().toString(36).substring(2)
    console.log(codeId)

    生成随机十六进制代码（生成随机颜色）
    const color = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')
    console.log(color);

    函数柯里化：是将多参函数转换成一系列的单参函数。
    //示例：
    var add1 = (a, b) => console.log(a + b);
    add1(1, 2);  // => 3
    //修改
    var add2 = a => b => console.log(a + b);
    add2(1)(2);  // => 3

    对数组或对象for遍历
    var arr = ['a', 'b', 'c']; 
    for(var i in arr){
        console.log(i)  //数组下标=>0,1,2
        console.log(arr[i]);//数组下标对应的值=>a,b,c
    }

    var arr = ['a', 'b', 'c']; 
    for(var i of arr){
        console.log(i); //数组每个元素值=>a,b,c
    }

    let str = "abc";
    for( var i of arr){
        console.log(i);//字符串每个字符=>a,b,c
    }

    var obj={name:"china",year:"2020",fn:function(){console.log(1)}};
    for(var i in obj){
        console.log(i)//对象的属性或方法=>name、year、fn
        console.log(obj[i]);//对象的属性值或方法=>china、2020、function(){console.log(1)}
    }
`}</pre>
            </div>
        )
    }
}


