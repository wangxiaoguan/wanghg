


// commonJs 规范 模块化编程 

// const word = "马上开始快乐的vue"
// const msg = "努力的你们精通了vue吗"

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

var {arr} = require("./demo");

// exports.word = word;
// exports.arr = arr;

// export {msg}

// export {arr} from "./demo";




const vm = new Vue({
    el:"#app",
    data:{
        arr:arr,
        word:"马上开始快乐的vue",
        title:"webpack+vue"
    }
})





