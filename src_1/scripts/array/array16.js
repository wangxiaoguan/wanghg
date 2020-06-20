
import React,{Component} from "react";
import './array.scss'
export default class Array16 extends Component{
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    
    render(){
        return(
            <div id='array16'>
                <h2>Promise</h2>
<pre>{`
    1、主要用于异步计算
    2、可以将异步操作队列化，按照期望的顺序执行，返回符合预期的结果
    3、可以在对象之间传递和操作promise，帮助我们处理队列
    4、Promise对象状态:
        Promise 对象代表一个异步操作，其不受外界影响，有三种状态：
        Pending（进行中、未完成的）
        Resolved（已完成，又称 Fulfilled）
        Rejected（已失败）。
`}</pre>
<pre>{`
    var promise  =  new Promise((resolve,reject)=>{
            resolve("好好学习")
    })
    promise.then(data=>{
        console.log(data)//'好好学习'
    })
`}</pre>
<pre>{`
    then()方法
    then 方法就是把原来的回调写法分离出来，在异步操作执行完后，用链式调用的方式执行回调函数。
    而 Promise 的优势就在于这个链式调用。我们可以在 then 方法中继续写 Promise 对象并返回，然后继续调用 then 来进行回调操作。
    可有两个参数，第一个是成功 resolve 调用的方法，第二个是失败 reject 调用的方法

    function getNumber(){
        return new Promise((resolve,reject)=>{
            let num = Math.ceil(Math.random()*10)
            if(num<5){
                resolve(num)
            }else{
                reject("数字大于5")
            }
        })
    }
    getNumber().then(
        data=>{
            console.log(data)
        },
        reason=>{
            console.log(reason)
        }
    )

    catch()方法：
    它可以和 then 的第二个参数一样，用来指定 reject 的回调

    getNumber().then(
        data=>{
            console.log(data)
        }
    ).catch(
        reason=>{
            console.log(reason)
        }
    )
`}</pre>
<pre>{`
    all()方法
    Promise 的 all 方法提供了并行执行异步操作的能力，并且在所有异步操作执行完后才执行回调。
    三个个异步操作是并行执行的，等到它们都执行完后才会进到 then 里面。同时 all 会把所有异步操作的结果放进一个数组中传给 then。
    「谁跑的慢，以谁为准执行回调」

    var Promise1 = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('1执行完成');
            resolve('数据1');
        }, 300);
    });
    var Promise2 = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('2执行完成');
            resolve('数据2');
        }, 600);
    });
    var Promise3 = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('3执行完成');
            resolve('数据3');
        }, 900);
    });
    Promise.all([Promise1,Promise2,Promise3])
    .then(
        results=>{
            console.log(results)//["数据1", "数据2", "数据3"]
        }
    )
`}</pre>
<pre>{`
    race()方法
    race的话只要有一个异步操作执行完毕，就立刻执行 then 回调。
    注意：其它没有执行完毕的异步操作仍然会继续执行，而不是停止。
    「谁跑的快，以谁为准执行回调」
    Promise.all([Promise1,Promise2,Promise3])
    .then(
        results=>{
            console.log(results)//["数据1"]
        }
    )
`}</pre>

            </div>
        )
    }
}


