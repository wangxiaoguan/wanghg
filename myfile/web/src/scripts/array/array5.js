
import React,{Component} from "react";
import './array.scss'
import {Button} from 'antd'
export default class Array2 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array2'>

<pre>{`
    Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
    const target = { a: 1, b: 2 };
    const source = { b: 4, c: 5 };
    const source2 = { c: 4, d: 7 };
    const obj = Object.assign(target,source,source2);
    console.log(target);                        //{ a: 1, b: 4, c: 5, d: 7 }
    console.log(source);                        //{ b: 4, c: 5 }
    console.log(source2);                       //{ c: 4, d: 7 }
    console.log(obj);                           //{ a: 1, b: 4, c: 5, d: 7 }


    hasOwnProperty表示是否有自己的属性,查找对象是否有某个属性,不会去查找它的原型链
    var obj = {
        a: 1,
        fn: function(){},
        c:{d: 5}
    };
    console.log(obj.hasOwnProperty('a'));        //true
    console.log(obj.hasOwnProperty('fn'));       //true
    console.log(obj.hasOwnProperty('c'));        //true
    console.log(obj.c.hasOwnProperty('d'));      //true
    console.log(obj.hasOwnProperty('d'));        //false, obj对象没有d属性  
`}</pre>
            </div>
        )
    }
}


