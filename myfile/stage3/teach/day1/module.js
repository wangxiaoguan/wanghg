

//  npm 下载 package  包   require 导入   模块
// commonJS 规范  当前最主流最广泛的模块化开发规范    module  

// 定义             define 模块
// 暴露接口          module.exports    exports
// 引入     require

// 模块定义  模块导出   模块引入 

// 规范和体现 

// commonJS规范是 nodeJS/Webpack 模块化开发 的规范和标准
// nodeJS/Webpack 是 commonJS规范的一种实现

// 任何的js文件本身就是一个模块  



const word = "这是我自定义的模块";    
const arr = ["小雷雷","大英子"];

const person = {
    msg:"我要 daydaup",
    say(){
        return "你们天天努力了吗"
    }
}


var { msg:msg,setCookies} = require("./demo");   // demo   {msg:"wh1803 "}
// var demo = require("./demo")   //demo.msg   demo.setCookies
setCookies("daydayup 1803");

// 导出方式 1 
module.exports = {
    word:word,
    arr,     // 对象属性名简写  key-value
    person
};