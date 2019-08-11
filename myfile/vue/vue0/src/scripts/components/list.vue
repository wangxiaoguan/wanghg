<template>
    <div>
        <h1>list电影列表</h1>
            <p v-for="(m ,index) in mv" :key="index" >
                <router-link 
                    :to="{name:'detail',params:{title:m.title,id:m.id},query:{year:m.year}}"
                >{{m.title}}--{{m.year}}</router-link>
            </p>
    </div>
</template>

<script>
export default {
    data(){    return {mv:[]}    },

    mounted(){
        this.$http.get("http://47.94.208.182:3000/movie",{
            params:{limit:16}   
        }).then(res=>{   this.mv = res.body;       })
    }


}
</script>

<style>

</style>



