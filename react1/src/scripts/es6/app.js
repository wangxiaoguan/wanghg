

// console.log("es6");


// 1. ES6   ECMAScript2015  ( Jscript 和 ActionScript)
// 2.ECMAScript   条条框框规则     JavaScript   区别

// JScript typeScript javaScript

// ECMAScript是JavaScript 的规则和标准
// JavaScript是ECMAscript 的一种体现

// typescript 微软语言 

// JavaScript = ECMAScript+ DOM + BOM

// DOM    document  object  model   

// BOM     browser object model  

// 3.babel

// Babel是一个广泛使用的ES6转码器，可以将ES6代码转为ES5代码，从而在现有环境执行


// 严格模式
// "use strict";

// 变量赋值之前必须声明
// alert(color); //undefined
// console.log(color);
// var color = 'red';


// 防止意外全局变量 当你的this为null或者undefined,会自动指向window(es5)
//  window.a =100;
// setInterval(function(){
// 	console.log(this);
// 	console.log(this.a);
// },1000)


// function fn(){this.a = "wh1706";}
// window.fn();    // window() 严格  不存在 
// var f = new fn();
// console.log(f.a);

// with 禁止使用with  (省略属性对象)
// location = window.location     href url search 
// window.location.href  window.location.search
// with(location) {console.log(href)}

// 拒绝重复的参数
// function demo(x,y,z,z){	console.log(x,y,z);}



// let 块级作用域(局部作用局)   
// if(true){ let a = 1000;}
// console.log(a);//error

// if(true){ var b = 1000;}
// console.log(b);//1000



// 变量提升   var 导致变量提升  let 不会导致变量提升  
// console.log(a);   
// console.log(b);      

// var a = 100;    
// let b = 10;      // babel let 转 var 

//  var 会产生变量提升
//  let 不会产生变量提升 

// console.log(foo);    // undefined  foo = ... 

// var foo = "abc123";   // 变量提升       1        2 
// let bar = "hello"     //  开辟内存并且赋值  执行的时候才会赋值  
// function demo(){      
//     console.log(foo);   // abc123
// }
// demo();


//  浏览器解析 js代码  
//  1. 浏览器预解析    
//     浏览器一行一行读取代码     var  foo   在内存开辟 地址 ，但是只是进行声明定义 
//     foo =  ... (未定义)
//  2. js执行 赋值  
//  读取执行所有函数方法   console.log(foo)  foo=...
//  =  赋值之后才会 获取值 

//  参数作用域  》 局部作用域  》 全局作用域  

// var a = 200;
// function demo(a=2000){
//     console.log(a);   // undefined    200    2000   2000
//     a = 88;
//     console.log(a);   // 88      88      88     88
// }
// console.log(a)   //  200    200     200    200
// demo(); 
// console.log(a);   // 200     88     200   200




// let a = 100;                     
// function demo(){
// 	console.log(a);   //  error  babel let==>var 
// 	let a = 1000;	
// 	console.log(a);   //   1000
// } 
// demo();
// console.log(a);     //  100


                       // 1         2
// var  b  =  10;         // a ...     a = 10
// function demo(t){      // demo ..   demo()
// 	if(t){
// 		var b  = 100;  // a ...    a = 100 x
// 		return b;
// 	}else{
// 		return b;      // a      undefined
// 	}
// }
// console.log(demo(false))



// let a  =  10;
// // //  let 声明局部变量 
// function demo(t){
// 	if(t){
// 		let a  = 100;  // 预解析  var a = ...   demo 函数开辟内存  a  ==undefined
// 		return a;
// 	}else{
// 		return a;
// 	}
// }
// // 局部作用域找不到变量就去全局作用域去找 
// console.log(demo(false))//10



// var num = 0;
// var fun = test();
// console.log(fun);  //undefined
// function test(){
//     num++;
//     if(num<10){
//         // debugger
//         // console.log(num)
//         test()//递归函数 最后返回10
//     }else{
//         return num;
//     }
// }


// // num =0
// function test(){
//     num=1;
//     if(1<10){
//         test()   // 注意此时的 test 已经没有   任何 return 
//     }
// }
// // num = 1
// function test(){
//     num=2;
//     if(2<10){
//         test()   // 注意此时的 test 已经没有  return 
//     }
// }
// // num = 10
// function test(){
//     num = 11;
//     if(11<10){
        
//     }
// }

// function test(){
//     if(num<10){
//         if(2<10){
//             if(3<10){
//                 if(4<10){
//                     if(5<10){
//                         if(){
//                                 return test()
//                         }else{}
//                     }
//                 }
//             }
//         }
//     }else{

//     }
// }


// for(var i=0;i<10;i++){

// }
// console.log(i);//10
// //  let 解决内存泄露问题 
// for(let j=0;j<10;j++){

// }
// console.log(j);//error


// var k=0;
// for(var i=0,j=0;i<12,j<8;i++,j++){   // ,逗号后面执行语句   判断i<12,j<8中逗号后面的语句
// 	k=i+j;
// }
// // //                   ,     ,   &&    ||
// console.log(i)    // 8    12    8    12
// console.log(j)    // 8    12    8    12 
// console.log(k);   // 14   22    14   22


//  const 定义常量  默认不可以被修改

// const fruit = "apple";
// fruit = "banana";
// console.log(fruit);//error

// 因为数组是  引用数值类型   
// const fruit = ["apple"];
// // fruit = "aaaaa"
// fruit.push("banana"); 
// console.log(fruit);  //["apple", "banana"]



//  解构赋值 
// ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构

//  数组解构赋值  
// var a = 10;
// var b = 100;
// var c = 1000;

// const [a,b,c] = [10,100,1000];
// // ...mapAction(['getList'])
// console.log(a);
// console.log(b);



// function breakfast(){
// 	return ["milk","hot","apple"]
// }

// // var fruit  = "banana";

// // var drink = "bear";

// let [drink,foot,fruit] = breakfast();

// console.log(fruit);


// 对象解构赋值  

// let {foo:foo,bar} = {foo:"foo",bar:"bar"}
// let {foo:foo1,bar:bar} = {foo:"foo",bar:"bar"}
// console.log(foo1);
// const {mv:mv} = this.state  = {mv:[]}

// function breakfast(){
// 	return {
// 		dessert:"cake",
// 		drink:"milk",
// 		fruit:"apple"
// 	}
// }

// var foot = breakfast();
// console.log(foot.dessert,foot.fruit);

// let {
// 	dessert:a,
// 	druik:b,
// 	fruit:c
// } = foot;
// console.log(a,b,c);

// var {
// 	dessert,
// 	drink,
// 	fruit
// } = foot;


// var {a,b,c} = this.props;  this.props = {a:1,b:2}


//  字符串模板

//  `${}`

// var fruit = "apple";
// var dessert = "cake";
// var breakfast = "今天的早上是"+fruit+"和"+dessert;
// var breakfast = `今天的早餐是${fruit}和${dessert}`;
// var breakfast = `今天的早餐是<b>${fruit}</b>和<b>${dessert}</b>`;
// var app = document.getElementById("app");
// app.innerHTML = breakfast;
// console.log(breakfast);
// console.log(breakfast.startsWith("今天1"));  //开头
// console.log(breakfast.endsWith("cake</b>")); // 结束
// console.log(breakfast.includes("早餐"));    // 包含


// 对象展开  扩展运算符   ...   
// const [a,...b] = [1,2,3,4];
// console.log(a);
// console.log(b);

// var fruit = ["apple","banana"];

// var food = ["cake",...fruit,"milk"];

// console.log(food);

// var  person = {
// 	age:28,
// 	sex:"男"
// }
// let newPerson = Object.assign({},person);   // extend  对象合并 
// var newPerson = {...person,username:"zuozuomu"};
// console.log(newPerson);
// let obj = { a: { b: 1 } };
// let { ...x } = obj;   // ...x 
// console.log(x)       // Object(a: { b: 1 })

// let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
// console.log(x,y,z);  


// 剩余操作符 1.不确定参数  2.参数展开

// function breakfast(dessert,drink,...fruit){
// 	console.log(dessert,drink,...fruit);
// }

// breakfast("cake","milk","apple","banana","orange",["watermelon","pear"],"lemon");

// function dinner(dessert,fruit,{location,restuarant}){
// 	console.log(`我今天晚上去${location} 的 ${restuarant} 吃了 ${fruit} 喝了 ${dessert}`)
// };

// dinner("cake","bear",{location:"金融港",restuarant:"老板娘"})


//  函数name 属性
//  render(){}

// function breakfast(){}
// console.log(breakfast.name);

// var demo = function(){

// }
// console.log(demo.name);   // es6 demo  es5 " "

// let bar = function baz(){

// }

// console.log(bar.name);


// 属性方法的简洁写法  允许直接写入变量和函数 (函数自变量) 对象属性

//  key-value 

// var dessert = "cake",fruit="apple",drink="milk";

// var food = {
// 	dessert:"cake",
// 	fruit:"apple",
// 	drink:"bear"
// }
// console.log(food)
// var dessert = "cake",fruit="apple",drink="milk";

// var food2 = {
// 	dessert:dessert,
// 	fruit:fruit,
// 	drink:drink,
// 	eat:function(){
// 		console.log("eating")
// 	}
// }
// console.log(food2);

// var food3 = {
// 	dessert,
// 	fruit,
// 	drink,
// 	eat(){
// 		console.log("eat")
// 	}
// }
// console.log(food3);

// var a = {
//     dessert:"cake"
// }

// a.dessert
// a["dessert"]

//  属性名表达式
//  1. 标识符 当做属性名
// var breakfast = {};
// breakfast.dessert = "cake";
// // console.log(breakfast);  
// var breakfast = {}
// let drink = "hot milk";
// breakfast.drink = "milk"; 
// // console.log(breakfast);
// breakfast[drink] = "love milk";
// console.log(breakfast)
// console.log(breakfast['hot milk'])   

//  2. 表达式当属性名
// var lastword = "last word";

// var  a = {
// 	'first word':"hello",
// 	[lastword]:"word"
// }
// console.log(a);
// console.log(a['first word'])
// console.log(a[lastword])
// console.log(a['last word'])


//  比较2个相等 
//  es5   ==相等运算符    ===  严格相等运算符 
// 前者会自动转换数据类型，后者的NaN不等于自身，以及+0等于-0
//  es6 Object.is()  它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致

// Object.is()
// +0==-0
// true
// +0===-0
// true
// 0=='0'
// true
// 0==='0'
// false
// NaN=="abc"
// false
// NaN==NaN
// false
// Object.is(NaN,'abc')
// false
// Object.is(NaN,NaN)
// true
// Object.is(+0,-0)
// false
// Object.is('0',0)
// false
// Object.is(1,-1)
// false

// Object.assign    $.extend  {...obj,username:'zzzz'}
// Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）
// 相同的覆盖  不同的追加 

// var fruit = "apple";
// var breakfast = {fruit};

// var dessert = "cake";
// var foot = Object.assign({},breakfast,{dessert},{dessert:"milk"});
// console.log(foot)

// ()=>{return "hello"}
// ()=>"hello"
// a=>a ;  
// (a,b)=>(a+b);


// 箭头函数  
//  () => {}    表示函数无返回  没有return  function(){}
//  () => "hello world"   表示函数有返回   function{ return 'hello world'}
//  a => a   function(a){return a}
// function demo(){
// 	console.log("demo")
// }

// var demo2 = (de)=>{console.log("daydayup "+de)}

// demo2("goodgoodstudy");

// function breakfast(dessert,fruit){
// 	return dessert + " ----   "+ fruit;
// }

// var break1 = (dessert,fruit)=>dessert+"---"+fruit; 

// console.log(break1("cake","apple"))



// list.map(function(item){

// })
// list.map((item)=>{console.log(item)})

// setInterval(()=>{
// 	console.log(new Date().getSeconds())
// },1000)

// var add = (num1,num2)=>num1+num2;

// //  参数名称不能重复 
// function add1(n1,n2){
// 	return n1+n2;
// }

// const getName = ({firstName,lastName})=>`姓:${firstName} 名:${lastName}`;

// console.log(getName({firstName:"steven",lastName:"jobs"}));


// 箭头函数有几个使用注意点。

// （1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

// （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

// （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

// （4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

//  5 箭头函数的this指向固化,因为箭头函数本身没有this,所以借用箭头函数外部代码块的this

// window.id = 100;  
// function foo(){
// 	var id = 43;
// 	//  this 
// 	//  箭头函数 没有自己的this this指向固化 指向　借用 箭头函数外部代码块 this 
// 	//  如果箭头函数外代码块 this 指向发送变化  箭头函数this就会随着变化
//     var that = this;
//     console.log(that);
// 	//  bind(this)
// 	setTimeout(()=>{ 
// 		console.log(this);  // that   // this 指向函数外部this 箭头函数没有自己this 指向 借用当前函数外部this 
// 		console.log("id=="+this.id) 
//     },1500);
    
// 	window.setTimeout(function(){
// 		console.log(this);
// 		console.log("id=="+this.id)
// 	},1500);
// }

//  foo()

// // this ==>  {id:8888}  call  apply 改变this 指向
// foo.call({id:8888})     

// let bar = (id)=>{foo.call({id:id})}   //   通过箭头函数实现继承 
// new bar(8000);



// console.log(null==undefined);
// console.log(null===undefined);
// console.log(NaN===NaN);
// console.log(typeof null);
// console.log(typeof undefined);

// let Origin = function(){
// 	this.find  =  7;
// 	this.hide = 8;
// }
// // Origin.find = 10;
// // Origin.hide = 100;
// Origin.prototype.find = 1;
// Origin.prototype.hide = 2;

// let o = new Origin();

// // o.find = 3;
// // o.hide = 4;

// console.log(Origin.find,Origin.hide);  // 构造器 属性  
// console.log(o.find,o.hide);

// import "./app"




//  class es6 定义类 
//  es5 类  构造函数  
//  prototype =={constructor __proto__  prototype对象属性方法 }
// function Person(age,name){
// 	this.age = age;
// 	this.name = name;
// }

// Person.prototype.say = function(){
// 	console.log("daydayup")
// }


// // ES5 实现继承  
// function OldPerson(age,name,word){
// 	this.word = word;
// 	Person.call(this,age,name)
// }

// console.log(Person);
// console.log(Person.prototype);
// console.log(Person.prototype.constructor==Person);
// Person.prototype.say();

// for(var i in Person.prototype){
// 	OldPerson.prototype[i] = Person.prototype[i];
// }

// console.log(OldPerson.prototype);

// es5 
// function Person(name,age){
//     this.name=name;
//     this.age=age;
// }
// Person.prototype.move = function(){
//     console.log(`${this.name} move fast`)
// }
// var p1 = new Person("zuozuomu",28);
// console.log(p1.name)
// p1.move();


// // es5 实现继承
// function Student(name,age,grade){
//     this.grade = grade;
//     Person.call(this,name,age);
// }

// Student.prototype = new Person();
// var p2 = new Student("阿童木",14,100);


// console.log(p2.grade);
// p2.move();
/**
 * ==============================================================================================
 */
// es6 定义构造函数
// class 

// class Person {
//     constructor(name,age){
//         this.name = name;
//         this.age = age;
//     }
//     static username = "abc"  // 静态属性  静态方法  不用new 直接获取
    
//     move(){   // Person.prototype.move = fn
//         // console.log("move move");
//         return  `${this.name  } move fast fast `
//     }
// }

// console.log(Person);
// console.log(Person.prototype);
// console.log(Person.prototype.constructor==Person);

// console.log(Person.username);
// var p1 = new Person("zuozuo",38)


// console.log(p1.age)
// console.log(p1.move());

// class   类  构造函数

// function Person(name,age){
//     this.name = name;
//     this.age = age;

//     this.say = function(){
//         console.log("hello wh1706")
//     }
// }

// Person.prototype.word = "day day up";
// Person.prototype.action = function(){
//     alert('大声咆哮出来！！！')
// }
// // var user = new Person("zkl",38);
// // console.log(user.word);
// // user.say();
// // user.action();

// function Student(name,age,grade){
//     this.grade = grade;
//     Person.call(this,name,age);    //继承 父类 的 construction  无法得到父类的prototype   原型对象 
// }
// // Student.prototype = new Student();
// var s1 = new Student("张",18,100);
// console.log(s1.name);

// // 对象复制 
// for(var i in Person.prototype){
//     Student.prototype[i] = Person.prototype[i]
// }
// s1.say();
// s1.action();

/**
 * ==============================================================================================
 */


//  Es6 定义 构造函数
// constructor  构造器 
// class Person {
//     constructor(name,age){
//         this.name = name;
//         this.age = age;
//         this.say = function(){
//             console.log("hello wh1706 ssssssss")
//         }
//     }

//     action(){    // Person.prototype.action()
//         alert("happy 2018 ")
//     }

//     walk(){
//         return "walk follow me"
//     }
// }
// // console.log(Person.prototype)
// var p1 = new Person("zkl",18);
// console.log(p1.name);
// // p1.say();
// // p1.action();




// // //  es6 继承  extends  全部继承  
// // // super  
// // // super()  方法  super 如果是方法 ，表示指向父类的 constructor
// // // super.move  对象   super 当着对象来使用  表示指向父类的 prototype 原型 


// class Student extends Person{

//     constructor(name,age,grade){
//         super(name,age);   //  ===>  指向父类  constructor
//         console.log(this);
//         this.grade = grade;
//     }

//     newaction(){
//         // 方法重写 
        
//     }

//     walk(){
//         return super.walk() + " day day up" 
//     }

// }

// var s1 = new Student("mingming",28,99);
// console.log(s1.name);
// console.log(Student.prototype);
// // s1.action();
// console.log(s1.walk())

// //  class App  extends Component{}
// class Student extends Person {
//     constructor(name,age,sex){
//         super(name,age);
//         console.log(this);
//         this.sex = sex;
//     }

//     static username = "abc123456789"

//     render(){
//         console.log("渲染组件")
//     }

//     move(){
//         // console.log(this);
//         return super.move() + "I am old boy"
//     }
// }

// var s1 = new Student("zuozuouu",80,"boy");
// // s1.move();
// console.log(s1.move())
// console.log(s1.name);
// console.log(Student.username);

// import React,{Component} from "react";
// import {render} from "react-dom";
// class App extends Component{

//     constructor(props){
//         super(props)

//         this.state={

//         }

//         this.click = this.click.bind(this);
//     }

//     click(){
//         console.log(this);
//     }

//     render(){
//         console.log(this);
//         return (
//             <div onClick={this.click}>
//                 hello react 
//             </div>
//         )
//     }
// }

// render(
//     <App/>,
//     document.getElementById("app")
// )
// App.propTypes={
//     name:"abc"
// }

// ES6 语法编写react
// Component 父类

// 1.必须通过 constructor super(props,context)  传入 props  context
// 2.由于是用ES6 class语法创建组件，其内部只允许定义方法，而不能定义属性，
// class的属性只能定义在class之外。所以propTypes要写在组件外部。 static App.propTypes = {}
// 3.对于之前的getDefaultProps方法，由于props不可变，所以现在被定义为一个属性，
// 和propTypes一样，要定义在class外部。


// 使用ES6 class语法创建组件， class中的方法不会自动将this绑定到实例中 此时this 为null
// 必须使用 .bind(this)或者 箭头函数 ＝>来进行手动绑定
// this.handleclick.bind(this)
// 箭头函数 来保存this
// ES6 语法不支持 混合函数  mixins












//  ES6 定义构造函数  定义类  
//  constructor()
// class Person {
// 	constructor(name,age){
// 		this.name = name;
// 		this.age = age;
// 		this.say = function(){
// 			console.log("daydayup")
// 		}
// 	}

// 	move(){
// 		return this.name + "move fast";
// 	}
// }

// // Person.prototype.move = function(){

// // }

// var p1 = new Person("zuozuomu",28);
// p1.say();
// console.log(p1.move())
// console.log(Person);
// console.log(Person.prototype);
// console.log(Person.prototype.constructor==Person);

// class Breakfast{
// 	constructor(dish){
// 		this.dish  = dish;
// 		this.menu = [];
// 	}

// 	getmenu(){
// 		return this.menu;
// 	}

// 	setMune(){
// 		this.menu.push(this.dish);
// 	}
// }

// var b = new Breakfast("milk");
// console.log(b.menu);
// b.setMune();
// console.log(b.getmenu())


// class Point{
// 	constructor(color){
// 		this.color =color ;
// 	}

// 	intro(){
// 		return "这个颜色是" + this.color
// 	}
// }

// var p = new Point("red");
// console.log(p.intro());




//  es6 如何实现继承 

//  子类去继承父类  

// extends 

// Class 可以通过extends关键字实现继承，这比 ES5 的通过修改原型链实现继承
// class Person {
// 	constructor(name,age){
// 		this.name = name;
// 		this.age = age;
// 		this.say = function(){
// 			console.log("daydayup")
// 		}
// 	}
// 	move(){
// 		return this.name + " move fast";
// 	}
// }


// class Student extends Person{

// 	constructor(name,age,grade){
// 		super(name,age);
// 		this.grade = grade;
// 	}
// 	test(){
// 		console.log(`${this.name}的成绩是  ${this.grade}`)
// 	}	
// 	move(){
// 		return  this.grade + super.move();
// 	}
// }

// //  super 关键字 
// //  super  当做函数使用时  super()  表示指向父类的 constructor
// //  super 当做对象实现时  super.    表示指向父类的 原型对象  prototype 对象

// // 如何得到父类  原型对象  prototype对象 
// console.log(Student.prototype);

// var s = new Student("zkl","15","100");
// s.test()
// console.log(s.move());


// class Point{
// 	constructor(color){
// 		this.color = color
// 	}
// 	intro(){
// 		return this.color;
// 	}
// }
// var p1 = new Point("red");

// // console.log(p1.color);
// class OldPoint extends Point{
// 	constructor(color,word){
// 		super(color);
// 		this.word = word;
// 	}

// 	intro1(){
// 		return this.word + " " + super.intro()
// 	}
// }
// // console.log(OldPoint)
// // console.log(OldPoint.prototype)

// // //  默认直接继承父类  constructor 
// // //  
// var p2 = new OldPoint("yellow","daydayup");
// // console.log(p2.color);
// // console.log(p2.word);
// console.log(p2.intro())
// console.log(p2.intro1())




// import React,{Component} from "react";
// import ReactDOM from "react-dom";

// class App extends React.Component{
	
// }

// ES6 语法编写react
// Component 父类

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


//  constructr this ===App 

//  App.prototype.add   this == null  this === App 
// class App extends Component{
// 	constructor(props){
// 		super(props);
// 		this.state = {
// 			word:"daydayup",
// 			count:100
// 		};
// 		console.log(this);

// 		// this.add = this.add.bind(this);  // 把constructor 内this绑定 到 自定义函数 
// 	}
// 	add(){
// 		console.log(this);
// 		this.setState({
// 			count:++this.state.count
// 		})
// 	}
// 	// add=()=>{
// 	// 	this.setState({
// 	// 		count:++this.state.count
// 	// 	})
// 	// }
// 	render(){
// 		return(
// 			<div>
// 				<h1>es6+react</h1>
// 				<h1>{this.props.txt}</h1>
// 				<h1>{this.state.word}</h1>
// 				<h1>{this.state.count}</h1>
// 				<button onClick={this.add}>++1</button>
// 			</div>
// 			)
// 	}
// 	componentWillMount() {
// 		console.log("willwillwill")
// 	}
// 	componentDidMount() {
// 		console.log("dididididdi")
// 	}
// }
// App.propTypes = {
// 	txt:React.PropTypes.string
// }

// App.defaultProps = {
// 	txt:"hello es6"
// }




// console.log(App);
// console.log(App.prototype);

// ReactDOM.render(
// 	<App/>,
// 	document.getElementById("app")
// 	)

