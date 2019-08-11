
import React,{Component} from "react";
import  {Button} from 'antd'
export default class Data13 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    setFocus=()=>{
        let el = this.refs.box; // jquery 对象转dom对象  
        el.focus();
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        //判断光标位置，如不需要可删除
        if (sel.anchorOffset != 0) {
            return;
        }
        sel.removeAllRanges();
        sel.addRange(range);
    }
    render(){
        return(
            <div id='data13'>
                 <div contentEditable='true' style={{width:600,height:400,border:'1px solid #ccc'}} ref='box'></div>
                 <div>
                    <Button type='primary' onClick={this.setFocus}>设置焦点</Button>

<pre>{`
setFocus=()=>{
    　　let el = this.refs.box; 
    　　el.focus();
    　　let range = document.createRange();
    　　range.selectNodeContents(el);
    　　range.collapse(false);
    　　let sel = window.getSelection();
    　　//判断光标位置，如不需要可删除
    　　if(sel.anchorOffset != 0){
    　　　　return;
　　    }
    　　sel.removeAllRanges();
    　　sel.addRange(range);
}
`}</pre>
 
                 </div>
                 

            </div>
        )
    }
}



