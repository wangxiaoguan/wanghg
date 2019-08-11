<template>
    <div class="box">
        <Head title="我" ></Head>
        <mt-button type="default">default</mt-button>
        <mt-button type="primary">primary</mt-button>
        <mt-button type="danger" size="large" >danger</mt-button>
        <mt-button size="small">small</mt-button>
        <mt-button size="large" type="primary" plain @click="gotoLogin">进入登录</mt-button>
        <mt-button size="normal">normal</mt-button>
    </div>
</template>

<script>
import router from "../router";
export default {
    methods:{
        gotoLogin(){
            // this.$router.push("")
            router.push({name:"login"})

        }
    }
}
</script>
