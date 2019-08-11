<template>
    <div class="section">
        <Head :title="$route.query.title" show="true"></Head>
        <h2>电影年份  {{movie.year}}</h2>
        <h2>电影导演  {{movie.directors[0].name}}</h2>
        <h2>电影分类  {{movie.genres}}</h2>
        <img v-lazy="movie.images.large" alt="" style="width:'100%';">

    </div>

</template>

<script>
import {Toast,MessageBox} from "mint-ui";
export default {
    data(){
        return {
            movie:null
        }
    },
    mounted(){
        this.$http.get("http://47.94.208.182:3000/detail",{
            params:{
                id:this.$route.params.id
            }
        }).then(res=>{
            this.movie = res.body;
            Toast("数据请求成功")
        })
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

