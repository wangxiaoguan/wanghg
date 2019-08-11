<template>
    <div class="section">
        <Head :title="$route.query.title" show="true"></Head>
        <img v-lazy="culture.picUrl" alt="">
        <p style="color:red;font-size:16px;padding:20px">{{culture.title}}</p>   
        <p style="color:#666;padding: 0 20px">作者:{{culture.author}}                   
        <span style="color:#aaa;font-size:10px;padding:0 20px">日期:{{culture.createTime}}</span>
        </p>  
        <p style="padding:0.15rem">{{culture.content}}</p>
    </div>

</template>

<script>
import {Toast,MessageBox} from "mint-ui";
export default {
    data(){return {culture:null}
    },
    mounted(){
        this.$http.get("http://60.205.201.113:3500/culture",{
            params:{id:this.$route.params.id }
        }).then(res=>{this.culture = res.body[0];console.log(res.body[0]); Toast("数据请求成功")
        })
    },
    // beforeRouteEnter (to, from, next) {
    //     // ...
    //     next()
    // },
    // beforeRouteLeave (to, from, next) {
    //     next();
    //     // MessageBox.confirm('你确定要离开我们吗.....??').then(action => {
    //     //     console.log(action);
    //     //     if(action){
    //     //         next()
    //     //     }
    //     // });
        
    // },
    // beforeRouteUpdate(to, from, next){
    //     next()
    // }
}
</script>
<style lang="css">
    img{width:100%}
</style>


