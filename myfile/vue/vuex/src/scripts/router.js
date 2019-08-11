


import Vue from "vue";
import VueRouter from "vue-router";

// 0
Vue.use(VueRouter)

// 1. 注册路由组件
import Layout from "./views/layout.vue";
import Guide from "./views/guide.vue"
import Wechat from "./views/wechat.vue";
import Contact from "./views/contact.vue";
import Find from "./views/find.vue";
import Mine from "./views/mine.vue";
import Detail from "./views/detail.vue";
import Login from "./views/login.vue";


// 2. 配置路由选项 
const routes = [
    {
        path:"/",
        component:Guide,
        name:"guide",
    },
    {
        path:"/app",
        component:Layout,
        name:"app",
        children:[
            {path:"",component:Wechat},
            {path:"home",component:Wechat,name:"home"},
            {path:"find",component:Find,name:"find"},
            {path:"mine",component:Mine,name:"mine"},
            {path:"exit",component:Contact,name:"exit"},
            {path:"*",redirect:"/app/home"}
        ]
    },
    {
        path:"/detail/movie/:id",
        name:"detail",
        component:Detail
    },
    {
        path:"/login",
        name:"login",
        component:Login
    },
    {
        path:"*",
        redirect:"/app/home"
    }
]

// 3. 创建router
const router = new VueRouter({
    routes,
    mode:"hash"
});


export default router;