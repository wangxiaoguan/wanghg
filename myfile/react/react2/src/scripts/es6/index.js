

//  ES5 实现构造函数   


// function Person(name,age,word){
//     this.name = name;
//     this.age = age;
//     this.word = word;

//     this.init = function(){
//         console.log(`${this.name} say : ${this.word}`);
//     }
// }

// Person.prototype.walk = function(){
//     console.log('跟时间赛跑的人最快乐==> '+this.age);
// }


// Person.find = 100;
// console.log(Person.find);
// console.log(Person.prototype)

// var p1 = new Person('zuozuomu',28,'天道酬勤');
// // Person.walk();
// p1.walk()
// p1.init();


// // ES5 实现继承  
// function Student(name,age,word,grade){
//     //  this 
//     this.grade = grade;
//     // Person.call(this,name,age,word);    // 只能继承得到 父类的 构造器 constructor 
//     Person.apply(this,[name,age,word]);
// }


// // 得到 prototype


// // 1 对象复制
// // for(var i in Person.prototype){
// //     Student.prototype[i] = Person.prototype[i]
// // }
// // 2 . 原型继承
// Student.prototype = new Person();


// // console.log(Student.prototype);
// // console.log(Student.find);

// var s1 = new Student('xiaolong',24,'dayadyup',100);
// // console.log(s1.name,s1.grade);
// s1.walk();



// ES6  定义构造函数
// class Person{
//     constructor(name,age,word){
//         this.name = name;
//         this.age = age;
//         this.word = word;
//         this.init = function(){ console.log(`init 初始化===> ${this.word}`)    }
//     }
//     static defaultProps = { msg:"daydayup" }
   
//     say(){   return `${this.name} say : 好好学习!`;}
//     walk(){  console.log(`不断努力--天道酬勤---- ${this.age}`);  }
// }
// Person.hobby = ["lol",'吃鸡']
// console.log('Person.prototype',Person.prototype);
// console.log('Person.hobby[0]',Person.hobby[0]);
// var p1 = new Person('xiaozuo',28,'学会感恩!!!');
// p1.init();
// console.log(p1.say());


// ES6  实现继承   extends 关键字  得到父类的构造函数对象和原型对象

//  super 当做函数使用的时候  表示指向父类的构造器  constructor  
//  spuer 当做对象 使用  表示指向父类的  prototype 原型对象   super = prototype 
// class Student extends Person{
//     constructor(name,age,word,grade){
//         super(name,age,word);     // super() ===> 父类  Person constructor()
//         this.grade = grade;
//     }
//     say(){ return super.say() + this.grade  }
//     get(){ console.log("getgetget"); }

// }

// console.log(Student.hobby);
// console.log(Student.prototype);
// var s1 = new Student('feifei',18,'我要睡觉',99);
// s1.init();
// s1.walk();
// s1.get();
// console.log(s1.say())

//  ES6 编写组件  React.Component Component 

// 1.必须通过 constructor super(props)  传入 props
// 2.由于是用ES6 class语法创建组件，其内部只允许定义方法，而不能定义属性，
// class的属性只能定义在class之外。所以propTypes要写在组件外部。
// 3.对于之前的getDefaultProps方法，由于props不可变，所以现在被定义为一个属性，
// 和propTypes一样，要定义在class外部。 


// 使用ES6 class语法创建组件， class中的方法不会自动将this绑定到实例中 此时this 为null
// 必须使用 .bind(this)或者 箭头函数 ＝>来进行手动绑定
// this.handleclick.bind(this)
// 箭头函数 来保存this
// ES6 语法不支持 混合函数  mixins

// import React,{Component} from "react";
// import ReactDOM,{render} from "react-dom";
// import {Button} from "antd-mobile";

// class App extends React.Component{

//     constructor(props,context){
//         // this ==> App 
//         super(props,context);
//         this.state = {
//             count:2018,
//             word:"daydayup"
//         }

//         this.add = this.add.bind(this);  //强制绑定 this  改变this 指向 
//     }

//     state = {word:"daydayup" }

//     static defaultProps = {   }

//     // change(){
//     //     console.log(this);  // ===> null
//     // }

//     change=()=>{
//         this.setState({ word:" class中的方法不会自动将this绑定到实例中"  })
//     }

//     // add(){
//     //     this.setState({ count:++this.state.count  })
//     // }
//     add=()=>{
//         this.setState({count:++this.state.count})
//     }

//     componentWillMount(){
//         console.log('this的指向',this);  // ===> App
//     }
//     componentDidMount(){
//         console.log("我是componentDidMount")
//         setTimeout(()=>{ this.setState({ word:" 你好，everyday"  });this.state.word},3000)
//     }
//     // shouldComponentUpdate(nextProps,nextState){
//     //     console.log('nextProps',nextProps)
//     //     console.log('nextState',nextState)
//     //     console.log('this.state',this.state)
//     //     console.log(nextState.count,this.state.count)
//     //     if(nextState.count!=this.state.count){
//     //         return true
//     //     }
//     //     return false
       
//     // }
//     componentWillUpdate(nextProps,nextState){
//         console.log('nextProps',nextProps)
//         console.log('nextState',nextState)
//         console.log("我是ComponentWillUpdate")
//     }
//     componentDidUpdate(nextProps,nextState){
//         console.log('nextProps',nextProps)
//         console.log('nextState',nextState)
//         console.log('我是componentDidUpdate')
//     }


//     render(){
//         console.log('render',this.props);
//         console.log('render',this.state);
//         return (
//             <div>
//                 <Button type='ghost' size="large" >{this.props.msg}-{this.props.num}</Button>
//                 <Button type="primary" size="large"  onClick={this.change}>{this.state.word}</Button>
//                 <Button type="warning" size="large"  onClick={this.add}>{this.state.count}</Button>
//             </div>
//         )
//     }
// }
// App.defaultProps = { 
//     msg:"react",
//     num:2018,
// }
// App.propTypes = {  
//     msg:React.PropTypes.string.isRequired,
//     num:React.PropTypes.number.isRequired
// }
// render(
//     <App/>,
//     document.getElementById("app")
// )
import './app'