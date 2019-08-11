



import Vue from "vue";
import VueResource  from "vue-resource"
Vue.use(VueResource);  // 全局声明 任何组件都使用 this.$http   Vue.http

import MintUI from "mint-ui";// import 'mint-ui/lib/style.css'
Vue.use(MintUI);

import App from "./components/app.vue";



Vue.component("myNav",{template:"<h1>nav-nav-nav</h1>"})

import router from "./router";

const vm = new Vue({
    el:"#app",
    router,  // 挂载路由 
    data:{    },
    components:{ "myApp":App }
})