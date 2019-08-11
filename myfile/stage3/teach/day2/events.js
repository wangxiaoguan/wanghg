


// 事件绑定  

// javascript 绑定事件 
// button class/id = 'btn'  btn.onclick = fn  onclick=fnuc()
// btn.addEventListener('click',fn,true/false) true 冒泡  false 捕获
// removeEventListener


// jQuery 事件绑定
// $(btn).on('click',fn);     off
// $(btn).bind('click',fn)    unbind('click')



// 事件委托  父元素 div
// $('div').on(click,childnode,fn) 
// $('div').delegate(childnode,click,fn) 

// 事件委托   基于事件冒泡的原理  把所有子元素的事件绑定到父元素 , 子元素触发事件, 父元素代替执行 


// node 事件模式  

var EventEmitter = require("events");
console.log(EventEmitter);   // 构造函数

// 定义子类 继承 父类 

// 1. call / apply 实现继承   改变this 来实现继承
function Player(){
    EventEmitter.call(this);
}
Player.prototype = new EventEmitter();


// 2. 继承方式 2
function Play(){
    return new EventEmitter()
}

var player = new Play();   // 实例化 
console.log(player);

// emit       发送事件 
// on         监听事件
// once       一次  监听一次

player.on("playx",(track)=>{
    console.log(`正在观看 ------ ${track}`)
});

player.once("pause",track=>{
    console.log(`现在已经基本不看 ------ ${track}`)
});

player.emit('playx','《我不是药神》');
player.emit('playx','《侏罗纪2》');

player.emit("pause","快乐大本营")
player.emit("pause","还珠格格")

