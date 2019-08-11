<template>
    <div>
        <h2 ref="two" >App模块</h2>
        <h2 @click="changeMsg">父组件msg{{msg}}</h2>

        <input type="text" v-model="title">

        <Head :title="title" number=1803 ref="one"  ></Head>
        <hr>
        <Hello v-on:buy-some="getmoney($event)">
            <h2 slot="h2">韦编三绝</h2>
            
        </Hello>
    </div>
</template>

<script>
import Head from "./head.vue";
import Hello from "./hello.vue";
export default {
    data(){return {title:"湖北", msg:"武汉" } },

    components:{ Head:Head, Hello },

    methods:{
        changeMsg(){this.$refs.one.msg = "天道酬勤"},
        set(){alert("博览群书")},
        getmoney(m){console.log(m);this.title = m;}
    },
    mounted(){    },
    watch:{    }
}
</script>
// scoped 这个样式只能作用于当前组件 
<style lang="css" scoped> 
    h2{ color:orange; }
</style>


