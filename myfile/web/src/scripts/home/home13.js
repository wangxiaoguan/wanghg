
import React,{Component} from "react";
import './home.scss'
export default class Home13 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home13'> 
<pre>{`
第一种导出导入的方式：
import和export是对应的；
lib.js 文件======>
let bar = "stringBar";
let fn = function() {console.log("fn");};
export{bar,fn}

=====>main.js文件
import {bar,foo} from "lib";
`}</pre>
<pre>{`
第二种导出的方式：
　　这种方式是直接在export的地方定义导出的函数，或者变量：
lib.js文件=====>
export let foo=()=>{console.log("fnFoo")},bar="stringBar";

=====>main.js文件
import {foo, bar} from "lib";
`}</pre>
<pre>{`
第三种导出的方式：
　　在export接口的时候,使用 XX as YY， 把导出的接口XX名字改成YY， 比如： app as home， 
lib.js文件=====>
let fn0 = function() {console.log("fn0")};
let obj0 = {	};
export { fn0 as foo, obj0 as bar};

=====>main.js文件
import {foo, bar} from "lib";
`}</pre>
<pre>{`
第四种导出的方式：
　　这种导出的方式不需要知道变量的名字，相当于是匿名的，直接把开发的接口给export；
如果一个js模块文件就只有一个功能，那么就可以使用export default导出;
lib.js=====>
export default "string";

=====>main.js
import String from "lib";
`}</pre>
<pre>{`
let message = "中国梦，世界梦";
let person = {age:26,user:"wanghg"};
export default {message,person};//导出
import es6  from "./es6";//引入

let txt = "天道酬勤";
let msg = "悬梁刺股"
exports.txt = txt;//导出
exports.msg = msg;//导出
var {txt,msg } =  require("./name");//引入
`}</pre>
            </div>
    
        )
    }
}


