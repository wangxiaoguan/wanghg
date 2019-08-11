
import React,{Component} from "react";
import './css.scss'
import {Input} from 'antd'
export default class Css12 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }
    componentDidMount(){
     
    }
    inputTxt=(e)=>{
        let search=e.target.value;
        let script=document.createElement("script");
        script.src="https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd="+search;
        document.body.appendChild(script);
        let content=document.getElementById("contentlist");
        window.baidu={
            sug:function(data){
                let list=data["s"];
                let html="";
                list.map(function(item){
                    html+=`<li><a href="https://www.baidu.com/s?wd=${item}">${item}</a></li>`;
                })
                content.innerHTML=html;
            }
        }
    }
    render(){
        return(
            <div id='css12'> 
                {/* <input id="search"/> */}
                <Input placeholder='请输入' style={{width:200}} onChange={this.inputTxt}/>
                <ul id="contentlist">
                        
                </ul>
<pre>{`

    <input id="search">
    <ul id="content"></ul>
    
    <script>
    var searchinput=document.getElementById("search");
    var content=document.getElementById("content");
    window.baidu={
        sug:function(data){
        var list=data["s"];
        var html="";
        list.map(function(item){
            html+='<li><a href="https://www.baidu.com/s?wd="+item+">+"item"+</a></li>';
        })
        content.innerHTML=html;
    }
    }
    searchinput.onchange=searchinput.oninput=searchinput.onblur=function(){
        var search=searchinput.value;
        var script=document.createElement("script");
        script.src="https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd="+search;
        document.body.appendChild(script);
    }


    </script>
`}</pre>
            </div>
    
        )
    }
}


