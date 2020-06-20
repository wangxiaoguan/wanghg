
import React,{Component} from "react";
import './array.scss'
export default class Array17 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array17'>
                <h1>async/await 异步</h1>
<pre>{`
用 async/await 来处理异步
　　先说一下async的用法，它作为一个关键字放到函数前面，用于表示函数是一个异步函数，因为async就是异步的意思， 
异步函数也就意味着该函数的执行不会阻塞后面代码的执行。 写一个async 函数

async function timeout() {
　　return 'hello world';
}
　　 语法很简单，就是在函数前面加上async 关键字，来表示它是异步的，那怎么调用呢？async 函数也是函数，
平时我们怎么使用函数就怎么使用它，直接加括号调用就可以了，为了表示它没有阻塞它后面代码的执行，我们在
async 函数调用之后加一句console.log;

async function timeout() {
    return 'hello world'
}
timeout();
console.log('虽然在后面，但是我先执行');
　　打开浏览器控制台，我们看到了

    虽然在后面，但是我先执行
   >

　　async 函数 timeout  调用了，但是没有任何输出，它不是应该返回 'hello world',  先不要着急， 看一
看timeout()执行返回了什么？ 把上面的 timeout() 语句改为console.log(timeout())

async function timeout() {
    return 'hello world'
}
console.log(timeout());
console.log('虽然在后面，但是我先执行');
　　继续看控制台

  ▶Promise {<resolved>: "hello world"}
    虽然在后面，但是我先执行

　　原来async 函数返回的是一个promise 对象，如果要获取到promise 返回值，我们应该用then 方法， 继续修
改代码

复制代码
async function timeout() {
    return 'hello world'
}
timeout().then(result => {
    console.log(result);
})
console.log('虽然在后面，但是我先执行');
复制代码 看控制台

    虽然在后面，但是我先执行
    hello world

　　我们获取到了"hello world',  同时timeout 的执行也没有阻塞后面代码的执行，和 我们刚才说的一致。

　　这时，你可能注意到控制台中的Promise 有一个resolved，这是async 函数内部的实现原理。如果async 函数中有
返回一个值 ,当调用该函数时，内部会调用Promise.solve() 方法把它转化成一个promise 对象作为返回，但如果timeout 
函数内部抛出错误呢？ 那么就会调用Promise.reject() 返回一个promise 对象， 这时修改一下timeout 函数

复制代码
async function timeout(flag) {
    if (flag) {
        return 'hello world'
    } else {
        throw 'my god, failure'
    }
}
console.log(timeout(true))  // 调用Promise.resolve() 返回promise 对象。
console.log(timeout(false)); // 调用Promise.reject() 返回promise 对象。
复制代码
　　控制台如下：



　　如果函数内部抛出错误， promise 对象有一个catch 方法进行捕获。

timeout(false).catch(err => {
    console.log(err)
})
　　async 关键字差不多了，我们再来考虑await 关键字，await是等待的意思，那么它等待什么呢，它后面跟着什么呢？
其实它后面可以放任何表达式，不过我们更多的是放一个返回promise 对象的表达式。注意await 关键字只能放到async 
函数里面
    await关键字也不能单独使用，是需要使用在async方法中。 await字面意思是"等待"，那它是在等什么呢？它是在等待后
面表达式的执行结果。
    await后面是支持非Promise函数的，但是执行的结果是不一样的，所以await针对所跟的表达式不同，有两种处理方式：
1、对于Promise对象，await会阻塞主函数的执行，等待 Promise 对象 resolve，然后得到 resolve 的值，作为 await 
表达式的运算结果，然后继续执行主函数接下来的代码。
2、对于非Promise对象，await等待函数或者直接量的返回，而不是等待其执行结果。


　　现在写一个函数，让它返回promise 对象，该函数的作用是2s 之后让数值乘以2

复制代码
// 2s 之后返回双倍的值
function doubleAfter2seconds(num) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2 * num)
        }, 2000);
    } )
}
复制代码
　　现在再写一个async 函数，从而可以使用await 关键字， await 后面放置的就是返回promise对象的一个表达式，
所以它后面可以写上 doubleAfter2seconds 函数的调用

async function testResult() {
    let result = await doubleAfter2seconds(30);
    console.log(result);
}
　　现在调用testResult 函数

testResult();
　　打开控制台，2s 之后，输出了60. 

　　现在我们看看代码的执行过程，调用testResult 函数，它里面遇到了await, await 表示等一下，代码就暂停到这里，
不再向下执行了，它等什么呢？等后面的promise对象执行完毕，然后拿到promise resolve 的值并进行返回，返回值拿到
之后，它继续向下执行。具体到 我们的代码, 遇到await 之后，代码就暂停执行了， 等待doubleAfter2seconds(30) 执
行完毕，doubleAfter2seconds(30) 返回的promise 开始执行，2秒 之后，promise resolve 了， 并返回了值为60， 
这时await 才拿到返回值60， 然后赋值给result， 暂停结束，代码才开始继续执行，执行 console.log语句。

　　就这一个函数，我们可能看不出async/await 的作用，如果我们要计算3个数的值，然后把得到的值进行输出呢？

复制代码
async function testResult() {
    let first = await doubleAfter2seconds(30);
    let second = await doubleAfter2seconds(50);
    let third = await doubleAfter2seconds(30);
    console.log(first + second + third);
}
复制代码
　　6秒后，控制台输出220, 我们可以看到，写异步代码就像写同步代码一样了，再也没有回调地域了。
`}</pre>
<pre>{`
//准备
function prepare(){
       return new Promise((resolve) => {
        setTimeout(function(){
          console.log("prepare chicken");
          resolve();
      },500)
    });  
}

//炒鸡
function fired(){
     return new Promise((resolve) => {
        setTimeout(function(){
          console.log("fired chicken");
          resolve();
      },500)
    }); 
}
//炖鸡
function stewed(){
     return new Promise((resolve) => {
        setTimeout(function(){
          console.log("stewed chicken");
          resolve();
      },500)
    }); 
}
//上料
function sdd(){
     return new Promise((resolve) => {
        setTimeout(function(){
          console.log("sdd chicken");
          resolve();
      },500)
    }); 
}
//上菜
function serve(){
     return new Promise((resolve) => {
        setTimeout(function(){
          console.log("serve chicken");
          resolve();
      },500)
    });
}
async function task(){
    console.log("start task");
   await prepare();
   await fired();
   await stewed();
   await sdd();
   await serve();
   console.log("end task");
}
task();

这段代码看上去神清气爽，我们来分析下代码：
    1、首先每个制作异步过程封装成Promise对象。
    2、利用await阻塞原理，实现每个制作的顺序执行。
相比较Generator实现，无需run流程函数，完美的实现了异步流程。

`}</pre>
                
            </div>
        )
    }
}


