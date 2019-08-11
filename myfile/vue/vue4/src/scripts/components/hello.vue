<template>
    <div>
        <h2>hello vue</h2>

        <slot name="h2">我马上会被覆盖的</slot>
        <button v-on:click="changeParent">自定义事件修改 </button>
        <button @click="show=!show">显示隐藏 </button>
        <transition name="fade" >
            <div class="static" v-if="show"></div>
        </transition>
        <button @click="show2=!show2">显示隐藏 </button>
        <transition name="slide" >
             <div class="static" v-if="show2"></div>
        </transition>
         <button @click="show3=!show3">显示隐藏 </button>
        <transition name="move" >
            <div class="static" v-if="show3"></div>
        </transition>
       
    </div>
</template>


<script>
export default {
    data(){return {show:true,show2:true,show3:true}},
    methods:{changeParent(){this.$emit("buy-some","学海无涯");} }
}
</script>

<style lang="css" scoped>
    .static{width:200px;height:200px;background:orange;}

    @keyframes move{
        from{transform: translateX(0)}
        to{transform: translateX(100%)}
    }

    .move{animation:move .8s ease both;}

    @keyframes fade-in{
        from{transform: translateX(-100%);opacity: 0;}
        to{transform:translateX(0);opacity:1 }
    }
    @keyframes fade-out {
        0%{transform:translateX(0);opacity:1}
        100%{transform: translateX(-100%);opacity: 0;}
    }
    /* v-enter-active */
    .fade-enter-active{animation:fade-in 1.5s ease both;}
    .fade-leave-active{animation:fade-out 1.5s ease both;}

    @keyframes slide-in{
        0%{transform: translateY(-100%) scale(0,0);}
        100%{transform: translateY(0%) scale(1,1);}
    }
    
    @keyframes slide-out{
        0%{transform: translateY(0%) scale(1,1);}
         100%{transform: translateY(-100%) scale(0,0);}
    }


    .slide-enter-active{animation:slide-in 1s ease both;}
    .slide-leave-active{animation:slide-out 1s ease both;}
    .move-enter-active{animation:bounceInLeft  2s;}
    .move-leave-active{animation:bounceOutRight 2s;}

</style>


