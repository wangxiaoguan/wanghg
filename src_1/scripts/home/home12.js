
import React,{Component} from "react";
import './home.scss'
export default class Home12 extends Component{
    constructor(props){
        super(props);
        this.state={
           
        }
    }

    render(){
        return(
            <div id='home12'> 
<pre>{`
浅拷贝
let arr1=[{x:1},2];
let arr2=arr1.concat();//浅拷贝
console.log(arr2);//[{x:1},2]
arr2[0].x=5;
arr2[1]=10;
console.log(arr1);//[{x:5},2]
console.log(arr2);//[{x:5},10]

深拷贝
function deepClone(data){
    var t = typeof data, o, i, ni;
    if(t === 'array') {
        o = [];
    }else if(t === 'object'){
        o = {};
    }else{
        return data;
    }
    if(t === 'array'){
        for(i = 0,ni = data.length;i < ni;i++){
            o.push(deepClone(data[i]));
        }
        return o;
    }else if(t === 'object'){
        for(i in data){
            o[i] =deepClone(data[i]);
        }
        return o;
    }
}
function copy (obj) {
    var newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    }
    for(var i in obj){
    newobj[i] = typeof obj[i] === 'object' ?
    copy(obj[i]) : obj[i];
    }
    return newobj
}

`}</pre>
            </div>
    
        )
    }
}


