


import Vue from "vue";
import VueRouter from "vue-router";

// 0
Vue.use(VueRouter)

// 1. 注册路由组件
import Layout from "./views/layout.vue";
import Guide from "./views/guide.vue"
import Home from "./views/home.vue";
import Goods from "./views/goods.vue";
import Mine from "./views/mine.vue";
import Detail from "./views/detail.vue";
import Login from "./views/login.vue";
import Register from "./views/register.vue";
import Teadetail from "./views/teadetail.vue";
import Msgdetail from "./views/msgdetail.vue";
import Goodsdetail from "./views/goodsdetail.vue";

import Culture from "./views/culture.vue";
import Shopcar from "./views/shopcar.vue";
import Item1 from  "./views/item1.vue";


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
            {path:"",component:Home},
            {path:"home",component:Home,name:"home"},
            {path:"goods",component:Goods,name:"goods"},
            {path:"culture",component:Culture,name:"culture"},
            {path:"mine",component:Mine,name:"mine"},
           
            {path:"*",redirect:"/app/home"}
        ]
    },
    {
        path:"/detail/movie/:id",
        name:"detail",
        component:Detail
    },
    {
        path:"/teadetail/:id",
        name:"teadetail",
        component:Teadetail
    },
    {
        path:"/msgdetail",
        name:"msgdetail",
        component:Msgdetail
    },
    {
        path:"/goodsdetail",
        name:"goodsdetail",
        component:Goodsdetail
    },
    {
        path:"/login",
        name:"login",
        component:Login
    },
    {
        path:"/register/abc",
        name:"register",
        component:Register
    },
    {
        path:"/shopcar/go",
        name:"shopcar",
        component:Shopcar
    },
    {
        path:"/item1",
        name:"item1",
        component:Item1
    },
    {
        path:"*",
        redirect:"/app/home"
    },

]

// 3. 创建router
const router = new VueRouter({
    routes,
    mode:"hash"
});


export default router;