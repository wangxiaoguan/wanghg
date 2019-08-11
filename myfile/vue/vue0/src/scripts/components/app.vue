


<template>
    <div>
        <h1>APP←←←←←←←←←←←←←←head</h1>
        <Head></Head>
        <h2>============================================================</h2>
    </div>
</template>

<script>
import Head from './head.vue';

export default {
    data(){  return    {}     },
    methods:{},
    mounted(){},
    watch:{},
    components:{Head:Head},
}
</script>

// scoped 这个样式只能作用于当前组件 
<style lang="css" scoped> 
    h2{color:rgb(7, 252, 219); }
</style>

