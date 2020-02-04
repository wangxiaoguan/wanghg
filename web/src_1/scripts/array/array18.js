
import React,{Component} from "react";
import './array.scss'
export default class Array18 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array18'>
                <h1>Generator</h1>
<pre>{`
一、什么是Generator 函数
Generator函数，官方给的定义是"Generator函数是ES6提供的一种异步编程解决方案"。我认为它解决异步编程的两大问题
    ▶回调地狱
    ▶异步流控
    那什么是异步的流控呢，简单说就是按顺序控制异步操作，以上面的肚包鸡为例，每个工序都是可认为异步的过程，工序
之间又是同步的控制(上一个工序完成后，才能继续下一个工序)，这就是异步流控。
先看下面的Generator函数，

function* helloGenerator() {
       console.log("this is generator");
}
这个函数与普通的函数区别是在定义的时候有个*,我们来执行下这个函数。

function* helloGenerator() {
       console.log("this is generator");
   }
helloGenerator();//没有执行
我们发现，并没有像普通的函数一样，输出打印日志。我们把代码改成下面：

function* helloGenerator() {
   console.log("this is generator");
 }
var h = helloGenerator();
h.next();
这个时候如期的打印了日志，我们分析下，对于Generator函数，下面的语句

var h = helloGenerator();
仅仅是创建了这个函数的句柄，并没有实际执行，需要进一步调用next(),才能触发方法。

function* helloGenerator() {
       yield "hello";
       yield "generator";
       return;
   }
   var h = helloGenerator();
   console.log(h.next());//{ value: 'hello', done: false }
   console.log(h.next());//{ value: 'generator', done: false }
   console.log(h.next());//{ value: 'undefined', done: true }
这个例子中我们引入了yield这个关键字，分析下这个执行过程

(1)创建了h对象，指向helloGenerator的句柄，

(2)第一次调用nex()，执行到"yield hello"，暂缓执行,并返回了"hello"

(3)第二次调用next()，继续上一次的执行，执行到"yield generator",暂缓执行，并返回了"generator"。

(4)第三次调用next(),直接执行return，并返回done:true，表明结束。

经过上面的分析，yield实际就是暂缓执行的标示，每执行一次next()，相当于指针移动到下一个yield位置。

总结一下，Generator函数是ES6提供的一种异步编程解决方案。通过yield标识位和next()方法调用，实现函数的分段执行。

二、Generator 函数与迭代器(Iterator)

    经过上一篇我们学过迭代器，大家对于迭代器接口的next方法应该不陌生，Generator函数也涉及到next()方法的调用,
他们之间有什么关系呢？实现了迭代器接口的对象都可以for-of实现遍历。我们来测试下：

function* helloGenerator() {
       yield "hello";
       yield "generator";
       return;
   }
   var h = helloGenerator();
   for(var value of h){
   	  console.log(value);//"hello","generator"
   }
   helloGenerarot对象是支持for-of循环的，也说明Generator函数在原型上实现了迭代器接口，上面调用的next()方法
其实就是迭代器的next()方法。我们继续来看next()方法。

function* gen(x,y){
   	  let z= yield x+y;
   	  let result = yield z*x;
   	  return result
   }
   var g = gen(5,6);
   console.log(g.next());//{value: 11, done: false}
   console.log(g.next());//{value: NaN, done: false}
分析上面的代码：

1、第一执行next()，运行"yield x+y"，并返回x+y的运算结果11；

2、第二次执行next()，运行"yield z*x",此时是z为11，x为5，运算结果为55才对，为何是NaN呢？前一次运行yield x+y的
值并没有保存，let z=yield x+y，结果是let z=undefined，所以运算z*x的结果是NaN。

那有没有办法解决这个问题，我们来改下这个例子：

function* gen(x,y){
   	  let z= yield x+y;
   	  let result = yield z*x;
   	  return result
   }
   var g = gen(5,6);
   console.log(g.next());//{value: 11, done: false}
   console.log(g.next(11));//{value: 55, done: false}
  请注意，我们第二次调用的时候，next方法中传入了参数11，此时得到正确的结果。next()方法是可以带参数的，其中的
参数就替换了上一次yield执行的结果。在这个例子中yield x+y就替换成了11，即

let z=yield x+y 替换成了let z=11，所以得到了正确的值。

道友们可能要问，不能每次都算好上一次的运行结果，作为下一次next的入参吧，这有啥用，我们继续：

function* gen(x,y){
   	  let z= yield x+y;
   	  let result = yield z*x;
   	  return result
   }
   var g = gen(5,6);
   var i =g.next();//{value: 11, done: false}
   g.next(i.value);//{value: 55, done: false}
这样就解决了，无论上次运行什么结果，我们都可以作为下一次的值传入。

对于迭代器(Iterator)接口，还有一个return()方法，我们来看下:

function* gen(x,y){
   	  yield 1;
   	  yield 2;
   	  yield 3;
   }
   var g = gen();
   g.next();//{value: 1, done: false}
   g.next();//{value: 2, done: false}
   g.return();//{value: undefined, done: true}
   g.next();//{value: undefined, done: true}
执行return()方法后就返回done:true，Generator 函数遍历终止，后面的yield 3不会再执行了。与next()方法一样，
return()也可以带参数。

function* gen(x,y){
   	  yield 1;
   	  yield 2;
   	  yield 3;
   }
   var g = gen();
   g.next();//{value: 1, done: false}
   g.next();//{value: 2, done: false}
   g.return(5);//{value: 5, done: true}
   g.next();//{value: undefined, done: true}
此时，value就是return传入的值，执行return后结束，调用next(),将不会执行 yield 3。

三、yield 表达式

   上面我们说到yield是Generator函数的暂缓执行的标识，对于yield只能配合Generator函数使用，在普通的函数中
使用会报错。可以执行下面的代码，看下结果

function gen(x,y){
   	  yield 1;
   	  yield 2;
   	  yield 3;
   }//报错
Generator函数中还有一种yield*这个表达方式，看看它有什么作用。

function* foo(){
   	yield "a";
   	yield "b";
   }
   function* gen(x,y){
   	  yield 1;
   	  yield 2;
   	  yield* foo();
   	  yield 3;
   }
   var g = gen();
   console.log(g.next());//{value: 1, done: false}
   console.log(g.next());//{value: 2, done: false}
   console.log(g.next());//{value: "a", done: true}
   console.log(g.next());//{value: "b", done: true}
   console.log(g.next());//{value: "3", done: true}
我们来分析下过程，当执行yield*时，实际是遍历后面的Generator函数，等价于下面的写法：

function* foo(){
   	yield "a";
   	yield "b";
   }
   function* gen(x,y){
   	  yield 1;
   	  yield 2;
   	  for(var value of foo()){
   	  	yield value;
   	  }
   	  yield 3;
   }
注意：yield* 后面只能适配Generator函数。

四、应用

   讲了这么多，那么Generator函数用在什么场景呢？要回答这个问题，首先我们总结Generator它的特点，一句话：
可以随心所欲的交出和恢复函数的执行权，yield交出执行权，next()恢复执行权。我们举几个应用场景的实例。

1、协程

   协程可以理解成多线程间的协作，比如说A，B两个线程根据实际逻辑控制共同完成某个任务，A运行一段时间后，暂缓
执行，交由B运行，B运行一段时间后，再交回A运行，直到运行任务完成。对于JavaScript单线程来说，我们可以理解
为函数间的协作，由多个函数间相互配合完成某个任务。


`}</pre>
            </div>
        )
    }
}


