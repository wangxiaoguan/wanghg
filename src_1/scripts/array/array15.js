
import React,{Component} from "react";
import './array.scss'
export default class Array15 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array15'>
<pre>{`
let reg=/\>[\u4e00-\u9fa5_a-zA-Z0-9\,\;\.\?\。\；\，\、\(\)\/\（\）\‘\“\’\”\"\']+\</ig;
let txt= html.match(reg).join("").replace(/\<\>/ig,""); 
console.log(txt)    
 
a{
    color: rgba(0,0,0,.25);
    cursor: not-allowed;
    pointer-events:none; //点击事件禁用
}

devDependencies   --save-dev    开发环境
dependencies    --save     生产环境


new webpack.ProvidePlugin({})
ProvidePlugin，是webpack的内置模块
使用ProvidePlugin加载的模块在使用时将不再需要import和require进行引入
以jquery为例，用ProvidePlugin进行实例初始化后，jquery就会被自动加载并导入对应的node模块中
new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
})
$('#item'); 
jQuery('#item');

PubSubJS发布/订阅库
npm install pubsub-js --save
import PubSub from 'pubsub-js'
const PubSub = require('pubsub-js');
PubSub.subscribe('PubSubmessage', function (message,data) {  console.log(data)   }）//订阅
PubSub.publish('PubSubmessag',this.state.increase);//发布
PubSub.unsubscribe('PubSubmessage')//退订


将网页打包成桌面应用（web页面生成exe）
npm install electron-packager -g
npm install electron -g
中文转拼音
npm install pinyin --save  ES2017(慎用)
npm install pinyin4js  --save  ES5

react捕获
e.nativeEvent.stopImmediatePropagation()
`}</pre>
<pre>{`
var txt = '{ "sites" : [' +
'{ "name":"菜鸟教程" , "url":"www.runoob.com" },' +
'{ "name":"google" , "url":"www.google.com" },' +
'{ "name":"微博" , "url":"www.weibo.com" } ]}';
var obj = eval ("(" + txt + ")");
`}</pre>
               
            </div>
        )
    }
}


