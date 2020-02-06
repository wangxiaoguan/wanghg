<template>
    <mt-header style="background: red" :title="title">
        <mt-button icon="back" slot="left" @click="goback" v-if="show" >返回</mt-button>
        <mt-button icon="more" slot="right" v-if="show" ></mt-button>
    </mt-header>
</template>
<script>
import router from "../router";
export default {
    props:["title","show"],
    methods:{
        goback(){
            console.log(this.$router);
            // this.$router.go(-1);
            router.go(-1);
        }
    }
}
</script>
<style lang="scss">
    // mt-header{background: red}
</style>

