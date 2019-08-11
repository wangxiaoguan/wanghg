<template>
    <div>
        <p><router-link :to="{name:'app'}">首页</router-link></p>
        <p><router-link :to="{name:'list'}">电影列表</router-link></p>
        <p><router-link :to="{name:'mine'}">我的</router-link></p>
    </div>
</template>

<style>

    .router-link-exact-active{  color:palegreen; }
</style>

