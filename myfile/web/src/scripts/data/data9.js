
import React,{Component} from "react";
import './data.scss'
import $ from 'jquery'
export default class Data9 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    componentDidMount(){
        document.getElementById('data9App').addEventListener("paste",function(e){
            let pastedText = '',pastedFile='';
            if (window.clipboardData && window.clipboardData.getData) { // IE
                pastedText = window.clipboardData.getData('Text');
            }else {
                pastedText = e.clipboardData.getData('text/plain');
                pastedFile = e.clipboardData.files;
            }
            console.log(pastedText,pastedFile)
        }); 
    }
    render(){
        return(
            <div id='data9'>
            <div contentEditable={true} id='data9App'></div>
<pre>{`
Js获取剪切板内容：
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


