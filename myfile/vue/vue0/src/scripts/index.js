

// const word="1803AAAAAAA";
// const msg="千锋教育";
// const message="好好学习 努力赚钱";
// exports.message=message;
// export {msg,word,arr};
// import {arr} from "./demo";




///////////////////////////////////////////////////





import Vue from "vue";
import VueResource  from "vue-resource"
Vue.use(VueResource);  // 全局声明 任何组件都使用 this.$http   Vue.http
import MintUI from "mint-ui";
// import 'mint-ui/lib/style.css'
Vue.use(MintUI);






import router from "./router";
const vm = new Vue({
    el:"#app",
    router,  // 挂载路由 
    data:{    },


})