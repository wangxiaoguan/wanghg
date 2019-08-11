

//  ES5  面向对象  constructor  prototype


// function Person(name,age,word){
//     this.name =  name;
//     this.age = age;
//     this.word = word;
//     this.init = function(){
//         console.log(`${this.name} 说: ${this.word}`)
//     }
// }
// Person.hobby = "游戏";
// Person.prototype.say = function(){
//     return this.name + "说 : daydayup~"
// }

// console.log(Person);
// console.log(Person.prototype);
// const p1 = new Person("zkl",28,"1803 努力到最后一天");
// p1.init();
// console.log(p1.age);
// console.log(p1.say());
// console.log(Person.hobby);


// // 继承  ES5 继承  
// // apply/call 改变this指向    无法继承得到父类的prototype 
// function  Student(name,age,word,score){
//     this.score = score;
//     Person.call(this,name,age,word);    // Person.apply(this,[name,age,word])
// }


// console.log(Student.hobby);

// // 得到父类的 prototype
// // 1. 直接复制
// Student.prototype = new Person();

// // 2. 对象复制
// // for(var i in Person.prototype){
// //     Student.prototype[i] = Person.prototype[i]
// // }

// Student.prototype.walk = function(){
//     console.log(`${this.name} I want to fly...`);
// }
// console.log(Student.prototype);
// const s1 = new Student("小明",20,"我要努力学习一辈子",60);
// s1.init();
// console.log(s1.say());
// s1.walk();


//  ES6 面向对象   
//  class  extends   定义构造函数

class  Person {
    constructor(name,age,word){
        this.name = name;
        this.age = age;
        this.word = word;
        this.init = function(){
            console.log(`${this.name} 说: ${this.word}---${this.age}`)
        }
    }
    static hobby = "游戏"
    say(){
        return `${this.name } 说 : 我最近很彷徨~ `;
    }
    job(){
        return "IT 程序员 "
    }
}
Person.game = "LOL"
console.log(Person);
console.log(Person.prototype);

var p2 = new Person("鹏展",20,"哦总有一天会展翅高飞的");
p2.init();
console.log(p2.say());

//  实现继承   extends 关键字  得到父类的构造函数对象和原型对象
//  super 当做函数使用的时候  表示指向父类的构造器  constructor  
//  spuer 当做对象 使用  表示指向父类的  prototype 原型对象   super = prototype 
class Student extends Person{
    constructor(name,age,word,score){
        super(name,age,word);   // super 继承父类的 constructor
        this.score = score;
    }

    say(){
        return "我最近很郁闷~你呢 "+ super.say(); 
    }


    walk(){
        return `${this.name}  : 我的心无处安放... `
    }
}
Student.hobby = "看书";

console.log(Student.prototype);

const s2 = new Student("花花",18,"我要努力争钱买更多的化妆品",100);
s2.init();
console.log(s2.say())
console.log(s2.walk())


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


import React,{Component} from "react";
import ReactDOM, {render} from "react-dom";

// class Component{
//     constructor(){

//     }
//     render(){
//     }
//     componentWillMount(){
//     }
//     componentDidMount(){
//     }
//     shouldComponentUpdate(){
//     }
//     componentDidUpdate(){

//     }
// }

class App extends Component{

    constructor(props,context){
        super(props,context);// 继承得到父类的props context 
        this.state = {
            count:1803,
            word:"你们努力了吗?"
        }

        this.add = this.add.bind(this);
    }

    state = {
        message:"wh1803-good"
    }

    componentWillMount(){
        console.log("will");
        console.log(this);
    }

    add(){
        this.setState({
            count:++this.state.count
        })
    }

    // 箭头函数永远this 指向当前函数定义所处的this 环境  
    changeWord = ()=>{
        this.setState({
            word:"class中的自定义方法不会自动将this绑定到实例中 此时this 为null"
        })
    }

    render(){
        const {msg} = this.props;
        const {message,word,count } = this.state;
        console.log(this.state);
        return (
            <div>
                <h2>ES6 class  extends component 创建组件 </h2>
                <h1 onClick={this.changeWord}>props=msg  {msg}  </h1>
                <h2 onClick={this.add}>state message  {word} ---- {count} </h2>
            </div>
        )
    }
}

App.defaultProps = {
    msg:"daydayUp",
}
App.propTypes = {
    msg:React.PropTypes.string.isRequired,
}




render(
    <App username="zuzouomumu"/>,
    document.getElementById("app")
)