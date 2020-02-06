<template>
    <div class="box">
        <Head title="发现" ></Head>
        <mt-search v-model="value"></mt-search>
        <Display></Display>
        <Counter></Counter>
    </div>
</template>

<script>

import Display from "../components/display.vue";
import Counter from "../components/counter.vue";

export default {
    data(){
        return {
            value:"1803",
        }
    },
    components:{
        Display,
        Counter
    }
}
</script>


<style scoped>
.mint-search{
    height:10vh;
}
</style>
