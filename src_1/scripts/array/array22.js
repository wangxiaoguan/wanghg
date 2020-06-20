
import React,{Component} from "react";
import './array.scss'
export default class Array22 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array22'>
                <h3>获取剪切板内容</h3>
<pre>{`
①object.onpaste=function(){myScript};
②object.addEventListener("paste", myScript);

object.addEventListener("paste",function(e){
    var pastedText = '';
    if (window.clipboardData && window.clipboardData.getData) { // IE
        pastedText = window.clipboardData.getData('Text');
    }else {
        pastedText = e.clipboardData.getData('text/plain');
        pastedFile = e.clipboardData.files;
    }
});   
`}</pre>
            </div>
        )
    }
}


