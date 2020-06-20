
import React,{Component} from "react";
import './array.scss'
export default class Array19 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array19'>
<pre>{`
    关于this的指向，是一个令人很头疼的问题.
    归根结底，this指向就一句话：谁最终调用函数，this指向谁！！！
    关于这点，老夫有三言相赠：
    1.this指向的，永远只可能是对象！
    2.this指向谁，永远不取决于this写在哪！而是取决于函数在哪调用。
    3.this指向的对象，我们称之为函数的上下文context，也叫函数的调用者。
　　下面请看具体情况。
　　1.通过函数名()直接调用：this指向window
    
    function func(){
        console.log(this);
    }
    通过函数名()直接调用：this指向window
    func(); // this--->window
            
    2.通过对象.函数名()调用的：this指向这个对象
  
    function func(){
        console.log(this);
    }
    通过对象.函数名()调用的：this指向这个对象

    a.狭义对象
        var obj = {
            name:"obj",
            func1 :func
        };
        obj.func1(); // this--->obj
                
    b.广义对象
    document.getElementById("div").onclick = function(){
        this.style.backgroundColor = "red";
    }; // this--->div

    3.函数作为数组的一个元素，通过数组下标调用的：this指向这个数组
    
    function func(){
        console.log(this);
    }
            
    函数作为数组的一个元素，通过数组下标调用的：this指向这个数组
    var arr = [func,1,2,3];
    arr[0]();  // this--->arr
     
    函数作为window内置函数的回调函数调用：this指向window（ setInterval setTimeout 等）
    
    function func(){
        console.log(this);
    }
    函数作为window内置函数的回调函数调用：this指向window
    setTimeout(func,1000);  // this--->window
    setInterval(func,1000); // this--->window
    
    4.函数作为构造函数，用new关键字调用时：this指向新new出的对象

    function func(){
        console.log(this);
    }
    函数作为构造函数，用new关键字调用时：this指向新new出的对象
    var obj = new func(); //this--->new出的新obj

    5.事件对象
    在 DOM 事件中使用 this，this 指向了触发事件的 DOM 元素本身
    document.getElementById("div").onclick = function(){
        this.style.backgroundColor = "red";
    }; // this--->div


    6.构造函数环境
    构造函数中的this 会指向创建出来的实例对象，使用new 调用构造函数时，会先创建出一个空对象，
    然后用call函数把构造函数中的this指针修改为指向这个空对象。执行完环境后，空对象也就有了相关的属性，
    然后将对象返回出去，所以说就不用我们自己手动返回啦~
    function Person() {
        this.name = 'zhar';
    }
    var p = new Person();
    console.log(p.name);

    综合以上，构造函数不需要返回值，如果我们指定一个返回值时，this的指向将发生变化
    function Person() {
        this.name = 'zhar';
        return {};
    }
    var p = new Person();
    console.log(p.name);//undefined

    function Person() {
        this.name = 'zhar';
        return {name:'tom'};
    }
    var p = new Person();
    console.log(p.name);//tom      
    如果构造函数返回对象(Object,Array,Function)，那 this 将指向这个对象，其它基础类型则不受影响

    function Person() {
        this.name = 'zhar';
        return 1;//number string boolean 等
    }
    var p = new Person();
    console.log(p.name);//zhar
    所以，如无必要我们通常不要设置构造函数的返回值
`}</pre>
            </div>
        )
    }
}


