

import Vue from "vue";

import VueResource from "vue-resource";
Vue.use(VueResource);  // 全局注册使用 vue.http

import  vueAwesomeSwiper from "vue-awesome-swiper"
Vue.use(vueAwesomeSwiper);

import MintUI  from "mint-ui";
Vue.use(MintUI);


import router from "./router";

import Head from "./components/head.vue";
Vue.component("Head",Head);

import store from "./vuex/store";
   
const vm = new Vue({
    data:{
        msg:"1803 vue-project",
        transitionName:"slide-right"
    },
    router, // 挂载到根实例 
    store:store,
    watch:{
        '$route':function(to,from){
            console.log(to,from);
            var topath = to.path.split("/").length;
            var frompath = from.path.split("/").length;
            console.log(topath,frompath);
            this.transitionName = topath>frompath ?  "slide-left" :'slide-right'
        }
    },
    computed:{

    }
}).$mount("#app")