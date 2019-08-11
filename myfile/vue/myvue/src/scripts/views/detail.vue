<template>
    <div class="section">
        <Head :title="$route.query.title" show="true"></Head>
        <img v-lazy="detail.picUrl" alt="" style="margin-top:40px">
        <p class="p1">{{detail.title}}</p>   
        <p class="p2">作者:{{detail.author}}                   
        <span class="p2_span">日期:{{detail.createTime}}</span>
        </p>  
        <p class="p3">{{detail.content}}</p>
    </div>

</template>

<script>
import {Toast,MessageBox,Indicator} from "mint-ui";
import {mapState,mapActions} from "vuex";
export default {
    data(){return {culture:null}  },


    methods:{   ...mapActions(['getdetail']),  },


    mounted(){

        Indicator.open({  text: '加载中...', spinnerType: 'triple-bounce' });


        this.getdetail({url:"/culture",id:this.$route.params.id})
    },
    computed:{     ...mapState(['detail'])   },
 
}
</script>
<style lang="css">
    img{width:100%}
    .p1{color:red;font-size:0.36rem;padding:0.2rem}
    .p2{color:#666;padding: 0 0.2rem}
    .p2_span{color:#aaa;font-size:0.2rem;padding:0 0.2rem}
    .p3{padding:0.15rem}

</style>


