<template>
    <div class="section ">
        <Head title="登录" show="true"></Head>
        <div class="padding ">
            <mt-field label="用户名" placeholder="请输入用户名" :value="username" @input="getUsername"></mt-field>
            <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phone"></mt-field>
            <mt-button type="primary" size="large" plain class="m-10">登录</mt-button>
            <mt-button type="primary" size="large" class="m-10">注册</mt-button>
        </div>
 

    </div>
</template>
<script>
import {mapState,mapMutations} from "vuex";

export default {
    data(){   return {}    },
    computed:{
        ...mapState(['username']),
        phone:{
            get(){return this.$store.state.phone; },
            set(newval){ // this.$store.commit("updatePhone",newval)
                this.updatePhone(newval)
            }
        }
    },
    methods:{
        ...mapMutations({  updateUsername:"getUsername"   }),
        ...mapMutations(['updatePhone']),
        getUsername(e){ console.log(e);  this.$store.commit("getUsername",e); }
    }

}
</script>

<style>
    .padding{
        box-sizing: border-box;
        padding: 10px; /*no*/
    }
    .m-10{
        margin-top:10px;/*no*/
    }
</style>
