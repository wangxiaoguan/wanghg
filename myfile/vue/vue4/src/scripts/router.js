


import Vue from "vue";
import VueRouter from "vue-router";

// 0 
Vue.use(VueRouter);

// 1. 定义路径组件

import Layout from "./components/layout.vue";
import App from "./components/app.vue";
import List from "./components/list.vue"
import Mine from "./components/mine.vue"
import Detail from "./components/detail.vue"

// 2. 定义路由配置对象 routes

const routes = [
    {
        path:"/",
        component:Layout,
        name:'layout',
        children:[
            {path:"",component:App},
            {path:"home",component:App,name:"home"},
            {path:"list",component:List,name:"list"},
            {path:"mine",component:Mine,name:"mine"},
            {path:"*",redirect:"/home"}
        ]
    },
    {
        path:"/detail/movie/:title/:id",
        component:Detail,
        name:"detail"
    },
    {
        path:"*",
        redirect:"/home"
    }
]


// 3. 创建router 对象 
const router = new VueRouter({
    routes,
    mode:"hash"
})

// 4. 挂载 

export default router ;