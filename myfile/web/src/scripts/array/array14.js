
import React,{Component} from "react";
import './array.scss'
export default class Array14 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array14'>
<pre>{`
    全局变量任何地方都可以访问
    var num = 12;
    function test() {
        console.log(num);
    }
    test();//12
`}</pre>
<pre>{`
    局部变量只能在内部调用
    function test() {
        var n = 100;
    }
    test();
    console.log(n);//报错
`}</pre>
<pre>{`
    函数内部声明的变量,如果不加var  表示全局变量
    function test() {  
        n = 99;
    }
    test();
    console.log(n);//99
`}</pre>
<pre>{`
    函数内部的全局变量与函数外部的全局变量
    function test() {
        var a = 10;
        console.log(a);
    }
    var a = 100;
    test();//10
    console.log(a);//100
`}</pre>  
                </div>
        )
    }
}


