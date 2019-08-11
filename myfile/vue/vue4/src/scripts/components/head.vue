<template>
    <div>
        <h2>子组件msg{{msg}}</h2>
        <h2>{{title}}----{{number}}</h2>
        <button @click="change">$parent修改父组件msg </button>
    </div>
</template>

<script>
export default {
    data(){  return {msg:"废寝忘食"}   },
    methods:{
        change(){
            this.$parent.msg = "悬梁刺股";
            this.$parent.set();
        }
    },
    props:["title","number"]//接受父组件传入的参数(数据)
}
</script>

<style>

</style>

