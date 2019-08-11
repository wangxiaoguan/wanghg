<template>
    <div class="section">
        <!-- vue-awesome-swiper -->
        <swiper :options="swiperOptions">
            <swiper-slide v-for="(img,index) in imgs " :key="index">
                <img :src="img" alt="" class="img" @click="gotoApp(index)">
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import p1 from "../../assets/images/slide1.png";
import p2 from "../../assets/images/slide2.png";
import p3 from "../../assets/images/slide3.png";
import p4 from "../../assets/images/slide4.png";

export default {
    data(){
        return {
             imgs:[p1,p2,p3,p4]  ,
             swiperOptions:{
                 loop:false,
                 autoplay:false,
                 speed:1200
             } 
        }
    },
    mounted(){
        if(localStorage.visitCount){
            localStorage.visitCount++;
            // 第二次访问就直接进入主页
            this.$router.push({name:"home"})
        }else{
            // first 1 
            localStorage.visitCount = 1;
        }
    },  
    methods:{
        gotoApp(index){
            if(index==this.imgs.length-1){
                this.$router.push({name:'home'});
            }
        }
    }
}
</script>

<style lang="css" scoped >
    .swiper-container ,.img{
        width:100%;
        height:100%;
    }
</style>

