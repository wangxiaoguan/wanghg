
import React,{Component} from "react";
import $ from 'jquery'
import './css.scss'

export default class Css6 extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    componentDidMount(){
        
    }
    render(){

        return(
            <div id='css6'> 
                <div contentEditable={true} placeholder={'contenteditable=true'} style={{width:700,height:120,border:'1px solid #000'}}></div>
                <div contentEditable={'plaintext-only'} placeholder='contenteditable=plaintext-only' style={{width:700,height:120,border:'1px solid #000'}}></div>
                <div className='editdiv' placeholder='style{-webkit-user-modify: read-write-plaintext-only}'  contentEditable={true} style={{width:700,height:120,border:'1px solid #000'}}></div>
<pre>{`
可编辑div的contenteditable属性值
'events', 'caret', 'typing', 'plaintext-only', 'true', 'false'. 
当contenteditable为plaintext-only,可编辑div只能输入纯文本
或者可编辑div的css样式为
-webkit-user-modify: read-write-plaintext-only,可编辑div只能输入纯文本

如何给div添加placeholder属性
<div class="app" contenteditable placeholder="请输入文字"></div>
.app:empty::before{
    color:#000;
    content:attr(placeholder);
}
`}</pre>
<pre>{`

`}</pre>
            </div>
    
        )
    }
}


