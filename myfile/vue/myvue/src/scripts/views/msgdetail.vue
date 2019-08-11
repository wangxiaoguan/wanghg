<template>
    <div class="section" >
        <Head title="最新消息" show="true"></Head>
        <h2 style="margin-top:40px">{{detail2.title}}</h2>
        <h5 >发表于{{detail2.createTime}}</h5>
        <img :src="detail2.picUrl" alt="">
        <h3>{{detail2.content}}</h3>
    </div>
</template>

<script>

import router from "../router";
import {Toast,MessageBox,Indicator} from "mint-ui";

import {mapState,mapActions} from "vuex";

export default {
    data(){  return { news:null,title:"最新消息" }    },


    methods:{   ...mapActions(['getdetail2'])    },

    mounted(){

        Indicator.open({ text: '加载中...', spinnerType: 'triple-bounce' });


        this.getdetail2({url:"/abc",id:this.$route.params.id})
    },
    computed:{     ...mapState(['detail2'])   },
   
   

}
</script>
<style lang="scss">
    .section img{width:100%}
    h2{padding:0.1rem;font-size:0.3rem;color:red}
    h5{padding:0.1rem;color:#aaa;}
    h3{padding:0.1rem;line-height:0.4rem;}
</style>

