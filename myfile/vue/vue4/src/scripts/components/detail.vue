<template>
    <div>
        <h2>movie 详情 --- {{$route.params.title}}-{{$route.query.year}}</h2>
        <h2>{{movie.title}}</h2>
        <img :src="movie.images.large"  alt="" width=300 height=200>
        <button @click="goback">返回</button>
    </div>
</template>

<script>
export default {
    data(){return {movie:null}},
    methods:{ goback(){this.$router.go(-1);} },

    created(){
        this.$http.get("http://47.94.208.182:3000/detail",{
            params:{id:this.$route.params.id}
        }).then(res=>{ 
            console.log(this.$route);
            this.movie = res.body})
    },
   
}
</script>

