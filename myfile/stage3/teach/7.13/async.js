
//  异步  

//  异步流程控制Async  
//  promise 
//  setTimeout 


var async = require("async");

// 控制事件执行顺序 

// series    串行    串行无关联     事件执行按照 书写顺序  一个接着一个执行  如果有一个事件执行抛出error  则结束所有事件 
// parallel   并行     并行无关联    所有的事件同时执行  事件之前不会产生error 影响 
// waterfall   串行有关联    前一个事件的结果会作用到下一个事件  

// async.series   串行无关联   2个参数  参数一 (对象/数组) 参数二 callback
// 数组  返回的结果就是数组    谁在前面谁先输出   
// console.time("wh1803");
// async.series([
//     function(callback){
//         setTimeout(()=>{
//             callback(null,"one")
//         },2000)
//     },
//     function(callback){
//         setTimeout(()=>{
//             callback(null,"two")
//         },1000)
//     }
// ],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
//     console.timeEnd("wh1803")
// })  

// 对象  得到的结果是对象   书写顺序就是结果顺序
// console.time("wh1803");
// async.series({
//     one:function(callback){
//         setTimeout(()=>{
//             callback(null,"one")
//         },2000)
//     },
//     two(callback){
//         setTimeout(()=>{
//             callback(null,"two")
//         },1000)
//     }
// },(err,result)=>{
//     if(err) throw err;
//     console.log(result);
//     console.timeEnd("wh1803")
// })  


// parallel  并行无关联 
// []     result ==> []     同步并行    
// {}    result ==> {}      异步并行

// 事件的总时间 取决于  最大的运行时间的某个事件
// 输出的结果的顺序  跟时间无关  谁在前面谁先输出
// console.time("wh1803");
// async.parallel([
//     function(callback){
//         setTimeout(()=>{
//             callback(null,"one");
//         },2000)
//     },
//     function(callback){
//         setTimeout(()=>{
//             callback(null,"two");
//         },1000)
//     }
// ],function(err,result){
//     if(err) throw err;
//     console.log(result);
//     console.timeEnd("wh1803");
// })


// {}    result ==> {}      异步并行
// 事件的总时间 取决于  最大的运行时间的某个事件
// 输出结果 跟顺序无关 跟执行时间有关  谁最短谁在前
// console.time("wh1803");
// async.parallel({
//     one(callback){
//         setTimeout(()=>{
//             callback(null,"one");
//         },2500)
//     },
//     two(callback){
//         setTimeout(()=>{
//             callback(null,"two");
//         },1500)
//     }
// },function(err,result){
//     if(err) throw err;
//     console.log(result);
//     console.timeEnd("wh1803");
// });


// waterfall 串行有关联  
// 前一个事件的结果会作用到下一个事件  
// 最后一个事件的callback 对应  最后回调函数的参数 
async.waterfall([
    function(callback){
        callback(null,"one","two");
    },
    function(arg1,arg2,callback){
        callback(null,arg1,arg2,"three");
    },
    function(arg1,arg2,arg3,callback){
        callback(null,[arg1,arg2,arg3,"wh1803","done"]);
    },
],(err,result)=>{
    if(err) throw err;
    console.log(result);
})