

import React,{Component} from "react";
import {Button} from 'antd'
import  E from 'wangeditor'
export default class Data12 extends Component{
    constructor(props){
        super(props);
        this.state={
            editorContent:''
        }
    }
    componentDidMount() {
        const elem = this.refs.editorElem
        const editor = new E(elem)
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
          this.setState({
            editorContent: html
          })
        }
        editor.create()
      }
    clickHandle=()=>{
        alert(this.state.editorContent)
    }
    render(){
        return(
            <div id='react12'>
                <div ref="editorElem" style={{textAlign: 'left'}}></div>
<pre>{`
import  E from 'wangeditor'
componentDidMount() {
　　const elem = this.refs.editorElem
　　const editor = new E(elem)
　　// 使用 onchange 函数监听内容的变化，并实时更新到 state 中
　　editor.customConfig.onchange = html => {
　　　　this.setState({editorContent: html})
　　}
　　editor.create()
}
`}</pre>
            </div>
        )
    }
}




