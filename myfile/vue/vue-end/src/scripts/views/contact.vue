<template>
    <div class="box">
        <Head title="退出" ></Head>
        <mt-swipe :auto="2000"  >
            <mt-swipe-item v-for="(m,id) in mvs" :key="id" >
                <img :src="m.images.large" alt="" class="my">
            </mt-swipe-item>

        </mt-swipe>
    </div>
</template>
<script>
import { Indicator } from 'mint-ui';
import {mapState,mapActions,mapGetters} from "vuex";
export default {
    data(){
        return {
            mv_1:[]
        }
    },
    mounted(){
        Indicator.open({
            text: '加载中...',
            spinnerType: 'triple-bounce'
        });

        // this.$http.get("http://47.94.208.182:3000/movie",{
        //     params:{
        //         limit:6
        //     }
        // }).then(res=>{
        //     console.log(res.body);
        //     setTimeout(()=>{
        //         this.mv = res.body;
        //         Indicator.close();
        //     },1200)
        // })

        this.getmv({url:"/movie",limit:18,callback:function(){
             setTimeout(()=>{
                 Indicator.close();
             },1200)
        }});
    },
    computed:{
        ...mapState(['mv']),
        ...mapGetters(['mvs'])
    },
    methods:{
        ...mapActions(['getmv'])
    }
}
</script>

<style scoped>
    .mint-swipe,.my{
        width:100%;
        height:300px; /*no*/
    }
</style>



