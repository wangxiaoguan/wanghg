<template>
    <div>
        <h2>layout 主视图 </h2>
        <Foot></Foot>
        <h2>===================================</h2>
        <router-view style="border:2px solid blue"></router-view>
    </div>
</template>

<script>
import Foot from "./foot.vue";
export default { components:{Foot}}
</script>

