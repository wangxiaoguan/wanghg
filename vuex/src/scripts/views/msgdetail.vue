<template>
    <div class="section" >
        <Head title="最新消息" show="true"></Head>
        <h2>{{news[0].title}}</h2>
        <h5 >发表于{{news[0].createTime}}</h5>
        <img :src="news[0].picUrl" alt="">
        <h3>{{news[0].content}}</h3>
    </div>
</template>

<script>

import router from "../router";
import {Toast,MessageBox} from "mint-ui";
export default {
    data(){  return { news:null,title:"最新消息" }    },
   
    mounted(){
        this.$http.get("http://60.205.201.113:3500/abc",{
            params:{  id:this.$route.params.id    }
        }).then(res=>{   this.news = res.body;console.log(res.body); Toast("数据请求成功")  })
    },
  beforeRouteEnter (to, from, next) {
        // ...
        next()
    },
    beforeRouteLeave (to, from, next) {
        next();
        // MessageBox.confirm('你确定要离开我们吗.....??').then(action => {
        //     console.log(action);
        //     if(action){
        //         next()
        //     }
        // });
        
    },
    beforeRouteUpdate(to, from, next){
        next()
    }
}
</script>
<style lang="scss">
    .section img{width:100%}
    h2{padding:0.1rem;font-size:0.3rem;color:red}
    h5{padding:0.1rem;color:#aaa;}
    h3{padding:0.1rem;line-height:0.4rem;}
</style>

