<template>
    <div class="box">
        <Head title="首页" ></Head>
        <mt-swipe :auto="2000" style="margin-top:40px" >
            <mt-swipe-item v-for="(m,id) in news" :key="id" >
                <img :src="m.picUrl" alt="" class="my">
            </mt-swipe-item>

        </mt-swipe>

        <p class="msg1 msgp1">最新消息</p>
        <section>
            <ul class="teaimg">
                <li class="enter" v-for="(m,id) in news" :key="id">
                    <router-link :to="{name:'msgdetail',params:{id:m.id},query:{id:m.id}}">
                        <img :src="m.picUrl" alt="">
                    </router-link>                    
                    <h3>{{m.title}}</h3>                   
                </li>
            </ul>
        </section>
        <p class="msg1 msgp2">最新品鉴</p>
         <ul class="tealist">
            <li class="enter2" v-for="(list,index) in cultures" :key="index">
                <router-link :to="{name:'teadetail',params:{id:list.id},query:{id:list.id}}" >
                <img :src="list.picUrl" alt="">
                <span class="message">
                    <span class="msg_span1" >{{list.title}}</span><br/>
                    <span class="msg_span2" >{{list.note}}</span><br/>
                    <span class="msg_span3" >详情...</span>
                </span>  
                </router-link>      
            </li>
        </ul>
    </div>
</template>
<script>
import { Indicator,Toast } from 'mint-ui';
import {mapState,mapActions} from "vuex";
export default {
    data(){  return {     }         },

    
    mounted(){
      Indicator.open({ text: '加载中...',   spinnerType: 'triple-bounce'   });


      this.getnews({url:"/abc"}),


      this.getculture({url:"/home1",limit:20,callback:function(){
             setTimeout(()=>{ Indicator.close(); },1200)
        } })
    },

    computed:{      ...mapState(['news','cultures']) },

    methods:{        ...mapActions(['getnews','getculture']),    }
}
</script>


<style lang="scss" scoped>
 .mint-swipe,.my{ width:100%;  height:160px; /*no*/ }
    .mint-swipe,.my{ width:100%; height:2.5rem}
    .box{overflow: hidden;margin-bottom:0.8rem;}
    img{width:100%;}
    .tealist{margin-top:0.2rem;text-align: center}
    .iconfont{display: block;width: 80px;height: 80px;;font-size: 80px;margin: 0 auto;color: rgb(80, 14, 185)}
    .teaList li{float: left;width:21%;overflow: hidden;margin:0 2%}
    .teaList li i{display: block;width:90px;height:90px;border-radius: 50%;background:#aaa}
    .msg1{width: 100%;padding:20px 0;text-align: center;height:1rem;line-height:1rem;overflow: hidden;margin:10px 0;
   ;color:#fff;font-size:36px}
    .msgp1{background:url(../../assets/images/a5.jpg) center center no-repeat}
    .msgp2{background:url(../../assets/images/a6.jpg) center center no-repeat}
    .teaimg img{width: 100%;}
    .teaimg li{width:100%;margin:20px 0;background: burlywood}



    .tealist{margin-bottom:0.3rem;}
    .tealist li{width: 100%;overflow: hidden;padding:20px 0;background: rgb(245, 244, 236);margin:10px 0}
    .tealist li img{width:130px ! important;float: left;}
    .message{font-size:20px;width:500px;float: left;text-align: left}
    .msg_span1{font-size:16px;color:red}
    .msg_span2{color:#aaa}
    .msg_span3{font-size:14px}
</style>



