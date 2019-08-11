

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
            <div id='data12'>
                <div ref="editorElem" style={{textAlign: 'left'}}></div>
                <Button onClick={this.clickHandle}>获取内容</Button>
                <div>
                <h3>import  E from 'wangeditor'</h3>
                componentDidMount() &#123;<br/>
                　　const elem = this.refs.editorElem<br/>
                　　const editor = new E(elem)<br/>
                　　// 使用 onchange 函数监听内容的变化，并实时更新到 state 中<br/>
                　　editor.customConfig.onchange = html => &#123;<br/>
                　　　　this.setState(&#123;editorContent: html&#125;)<br/>
                　　&#125;<br/>
                　　editor.create()<br/>
                &#125;
                </div>
            </div>
        )
    }
}




