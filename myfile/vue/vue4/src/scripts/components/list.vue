<template>
    <div>
        <h2>list-list-list</h2>

        <transition-group
            appear
            appear-active-class="appear"
            enter-active-class="enter"
            leave-active-class="leave"

        >
            <p v-for="(m ,index) in mv" :key="index"  class="op " :style="{animationDelay:100*index+'ms'}">
                <router-link 
                    :to="{name:'detail',params:{title:m.title,id:m.id},query:{year:m.year}}"
                >{{m.title}}--{{m.year}}</router-link>
            </p>
        </transition-group>
    </div>
</template>

<script>
export default {
    data(){return {mv:[]}},
    mounted(){
        this.$http.get("http://47.94.208.182:3000/movie",{
            params:{limit:16}   
        }).then(res=>{ this.mv = res.body; })
    }
}
</script>

<style>
    .op{
            width:100%;
            height:60px;  /*no*/
            margin:5px 0;
            font-size: 32px ; /*no*/
            color:#fff;
            background: yellowgreen;
    }
    .appear{animation:zoomIn 1.2s;}
    .enter{animation:wobble 1.2s;}

</style>


