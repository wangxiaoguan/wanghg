


// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。   ajax 

import axios from "axios";
axios.defaults.baseURL = "http://47.94.208.182:3000/"

const baseURL = "http://47.94.208.182:3000";
import Vue from "vue";


export default {
    increment(context){
        // context == store   =  {commit:func}  = {commit:commit} = {commit}
        // context.commit("mutations")  {commit:func}
        console.log("increment")  
        context.commit("increment")   // mutations 
    }, 
    decrement({commit}){  // action 参数解构 
        commit("decrement")  // mutationType  decrement
    },
    countadd({commit},preload){
        console.log(preload);
        commit("countadd",preload);
    },
    changeCity({commit},city){
        commit("changeCity",city);
    },
    changeMsg({commit},{msg}){
        commit("changeMsg",{msg});
    },
    changeUsername({commit},{username}){
        commit("changeUsername",{username});
    },
    changeData({commit},{url,id}){
        // ajax 异步
        // this.$http
        console.log(url);
        Vue.http.get(baseURL+url).then(res=>{
            console.log(res);
            commit("changeData",res.body);
        })
    },
    getmv({commit},{url,limit,callback}){
        axios.get(url,{
            params:{
                limit
            }
        }).then(res=>{
            console.log(res.data);
            commit("getmv",res.data);
            console.log(callback);
            callback();
        })
    }   
}