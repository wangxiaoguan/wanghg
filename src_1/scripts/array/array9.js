
import React,{Component} from "react";
import './array.scss'
export default class Array4 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    render(){
        return(
            <div id='array9'>
<pre>{`
document.onmousedown= function (e) {
    var evt=window.event||e;
    if(evt.button==0){
        console.log("鼠标右键点击")
    }else if(evt.button==1){
        console.log("鼠标中键点击")
    }else if(evt.button==2){
        console.log("鼠标左键点击")
    }
};
document.onkeydown=document.onkeyup = function (e) {
    var evt=window.event||e;
    var key=evt.which||evt.keyCode;
};

鼠标事件
鼠标点击    onclick  
鼠标滑动    onmousemove
鼠标经过    onmouseover    
鼠标离开    onmouseout 
鼠标按下    onmousedown   
鼠标松开    onmouseup 

document.onmousemove = function () {   };
document.onmouseover = function () {   };
document.onmouseout = function () {   };
document.onmouseup = function () {   };
document.onmousedown = function () {   };
document.onblur = function () {    };
document.onfocus = function () {    };

事件传递冒泡
if(evt.stopPropagation){
    evt.stopPropagation();
}else{
    evt.cancelBubble=true;
}

事件绑定其他事件
if(obj.addEventListener){
    obj.addEventListener("click",thing,true)
}else{
    obj.attachEvent("onclick",thing); //IE兼容代码
}

绑定事件
obj.addEventListener("click",thing ,true);//事件从外道里
obj.addEventListener("click",thing ,false);//事件从里到外

移除事件绑定
obj.removeEventListener("click",thing ,false);
obj.detachEvent("onclick",thing );IE兼容代码

阻止右键点击默认弹出列表框
document.oncontextmenu = function (e) {
    var evt = window.event||e;
    if(evt.preventDefault){
        evt.preventDefault()
    }else{
        evt.returnValue=false;
    }
}
`}</pre>
            </div>
        )
    }
}


