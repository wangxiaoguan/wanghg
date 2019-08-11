

// 每一个 Vuex 应用的核心就是 store（仓库）

// “store”基本上就是一个容器，它包含着你的应用中大部分的状态 (state)  组件的数据 data 

// Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，
// 若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。


//  你不能直接改变 store 中的状态。
//  改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。


import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import state from "./state";
import actions from "./actions";
import mutations from "./mutations"
import getters from "./getters";

const store = new Vuex.Store({
        state:{
            number:1000,
            city:"武汉wh",
            mv:[],
            msg:"hello vuex",
            obj:{username:"zkl"},
            data:"1803-----daydayup",
            username:"zkl1",
            phone:"10086",
            num:0,
            count:10
        },
        actions:actions,
        getters,
        mutations:{
            jia(state){state.count++;},
            jian(state){state.count--;}
         
         }
})

export default store;

