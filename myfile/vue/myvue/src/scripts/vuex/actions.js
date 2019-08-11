


// Action 提交的是 mutation，而不是直接变更状态。
// Action 可以包含任意异步操作。   ajax 

import axios from "axios";
import { Indicator ,Toast} from 'mint-ui';
// axios.defaults.baseURL = "http://47.94.208.182:3000/"
axios.defaults.baseURL = "http://60.205.201.113:3500";
const baseURL = "http://60.205.201.113:3500/home2";
const allUrl="http://60.205.201.113:3500/home2";
import Vue from "vue";
import { setTimeout } from "timers";


export default {



    getnews({commit},{url}){   axios.get(url).then(res=>{commit("getnews",res.data);})   },


    getculture({commit},{url,limit,callback}){   axios.get(url,{params:{limit}}).then(res=>{commit("getculture",res.data); callback();})   },

   
    getgoods({commit}){  Vue.http.get(baseURL).then(res=>{  
            setTimeout(()=>{
              commit("getgoods",res.body);
              Indicator.close();
            },1500)
      
    })},

    
    gettea({commit},{url,limit}){ 
          axios.get(url, {params:{ limit }}).then(res=>{
              setTimeout(()=>{
                commit("gettea",res.data);
                console.log(res)
                Indicator.close();

              },1500)
             
             
    })},
    getdetail({commit},{url,id}){ 
      axios.get(url, {params:{ id }}).then(res=>{
          setTimeout(()=>{
            commit("getdetail",res.data);
            
            Indicator.close();
          },1500)       
         
    })},

    getdetail2({commit},{url,id}){ 
      axios.get(url, {params:{ id }}).then(res=>{
          setTimeout(()=>{
            commit("getdetail2",res.data);
            
            Indicator.close();
          },1500)       
         
    })},

      

          



    
   
    }