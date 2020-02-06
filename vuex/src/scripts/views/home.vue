<template>
    <div class="box">
        <Head title="首页" ></Head>
        <mt-swipe :auto="2000"  >
            <mt-swipe-item v-for="(m,id) in message" :key="id" >
                <img :src="m.picUrl" alt="" class="my">
            </mt-swipe-item>

        </mt-swipe>
         <!-- <ul class="teaList">
           <li :to=""><i class="iconfont">&#xe611;</i><p>茶文化</p></li>
           <li><i class="iconfont">&#xe601;</i><p>茶活动</p></li>
           <li><i class="iconfont">&#xe69c;</i><p>茶课堂</p></li>
           <li><i class="iconfont">&#xe616;</i><p>茶道圈</p></li>
        </ul> -->
        <p class="msg1 msgp1">
            <!-- <img src="../../assets/images/a5.jpg" alt=""> -->
            最新消息
        </p>
        <section>
            <ul class="teaimg">
                <li v-for="(m,id) in message" :key="id">
                    <router-link :to="{name:'msgdetail',params:{id:m.id},query:{id:m.id}}">
                        <img :src="m.picUrl" alt="">
                    </router-link>
                    
                    <h3>{{m.title}}</h3>
                    <!-- <span>{{m.commentCount}}</span>　　
                    <span>{{m.browseCount}}</span>　　
                    <span>{{m.createTime}}</span>　　 -->
                </li>
            </ul>
        </section>
        <p class="msg1 msgp2">最新品鉴</p>
         <ul class="tealist">
            <li  v-for="(list,index) in lists" :key="index">
                <img :src="list.picUrl" alt="">
                <span class="message">
                    <span style="font-size:16px;color:red">{{list.title}}</span><br/>
                    <span style="color:#aaa">{{list.note}}</span><br/>
                    <router-link :to="{name:'teadetail',params:{id:list.id},query:{id:list.id}}" >
                        <span style="font-size:14px">详情...</span>
                    </router-link>      
                </span>
                
            </li>
        </ul>
        <!-- <ul class="goods">
            <li  v-for="(g,id) in list" :key="id">
                <router-link :to="{name:'goodsdetail',params:{id:g.id},query:{id:g.id}}">
                <img :src="g.picPath" alt="">
                <p >{{g.title}}</p>
                <h3 style="color:red">￥{{g.price}}</h3>
                <h3>已出售<span>{{g.soldCount}}</span>件</h3>
                </router-link>
            </li>
            
        </ul> -->
    </div>
</template>
<script>
import { Indicator,Toast } from 'mint-ui';
import {mapState,mapActions,mapGetters} from "vuex";
export default {
    data(){
        return {
            mv_1:[],lists:[],message:[]
        }
    },
    mounted(){
        Indicator.open({
            text: '加载中...',
            spinnerType: 'triple-bounce'
        });

        this.$http.get("http://60.205.201.113:3500/abc",{ params:{ limit:8}
        }).then(res=>{
            console.log(res.body);
            setTimeout(()=>{
                this.message = res.body;
                Indicator.close();
            },1200)
        })

         this.$http.get("http://60.205.201.113:3500/home1",{ params:{limit:100 }
        }).then(res=>{
            setTimeout(()=>{
                this.lists = res.body;
                this.show = true;
                Indicator.close();
                Toast({
                    message: '请求成功',
                    iconClass: 'icon iconfont icon-fanhuidingbu',
                    duration:400
                });
            },100)
        })

        // this.getmv({url:"/movie",limit:18,callback:function(){
      this.getmv({url:"/abc",limit:18,callback:function(){
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
        height:160px; /*no*/
    }
</style>
<style lang="scss" scoped>
    .mint-swipe,.my{ width:100%; height:2.5rem}
    .box{overflow: hidden;margin-bottom:100px;}
    img{width:100%;}
    .tealist{margin-top:20px;text-align: center}
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
</style>



