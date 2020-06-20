
import React,{Component} from "react";
import './react.scss'
export default class React5 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='react5'> 
            <h2>图片标签img</h2>
<pre>
{`
<img  src={this.state.src} onLoad={this.handleImageLoaded} onError={this.handleImageErrored} />
<img src={this.state.src} onError={(e) => {e.target.onerror = null;e.target.src=this.state.errorImg}}/>
`}</pre>
<pre>{`
<input type="text" placeholder="请输入标题" ref="title" />
获取input的值
this.refs.title.value
设置input的值
this.refs.title.value = '中华'


var arr1 = ['a', 'b', 'c']; 
for(var ch of arr1){
    console.log(ch); //a,b,c
}

let arr = "abc";
for( var char of arr){
    console.log(char);//a,b,c
}
`}</pre>
            </div>
    
        )
    }
}


