<template>
    <div class="section ">
        <mt-header style="background: red" :title="title">
            <mt-button icon="back" slot="left" @click="goback" >返回</mt-button>        
        </mt-header>
        <h2>{{itemname}}</h2>
        <h4 v-if="show0">{{dizhi}}</h4>
        
        <h3 v-for="(add,index) in address" v-if="show1" :key="index">
            <p>地址{{index+1}}:{{add}}</p>
        </h3>
       
       
        

    </div>
</template>
<script>
import {mapState,mapMutations} from "vuex";
import router from "../router";
import { Toast,Indicator } from 'mint-ui';


export default {
    data(){ 
        return {
            itemname:this.$route.params.itemname,
            dizhi:"无",
            name:this.$router.nameId,
            show:false,
            show0:false,
            show1:false,
            }  
    },
    computed:{    
             ...mapState(['address'])  

    },
      
    methods:{
        goback(){ router.go(-1);}
    },
        
      
    mounted(){
        if(this.itemname=="收货地址"){
           this.show1=true
        }else{this.show0=true}
      
    },

}
</script>

<style>
    .padding{ box-sizing: border-box;  padding: 10px; /*no*/ }
    .m-10{ margin-top:10px;/*no*/  }
    .padding h1{width: 100%;overflow: hidden;}
    .span1{float: left;width:2rem;font-size:0.3rem;}
    .span2{float: left;font-size:0.3rem;text-align: left;color:red }
    h2{font-size:0.4rem;padding:0.1rem;background: aliceblue;border-bottom:1px solid #aaa}
    h3{text-align:left;padding:0.2rem 0;font-size:0.25rem}
    h4{text-align:center;padding:0.2rem 0;font-size:0.4rem}
    p{padding:0 0.1rem;font-size:0.24rem;}
</style>
