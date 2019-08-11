<template>
    <div class="section" >
        <Head :title="news.title" show="true"></Head>
        <img :src="news.picPath" alt="">
        <h1 style="font-size:0.2rem">{{news.title}}</h1>
        <p class="price">售价:<span style="">￥{{news.price}}</span></p>
        <h3 style="color:#aaa">库存:{{news.stockCount}}　　　累计售出:　{{news.soldCount}}</h3>
        <h2>商品评价　　　　　　　{{news.soldCount}}条评价</h2>
        <h4 class="car" >
            <span class="addcar" @click="addcar">加入购物车</span>
            <!-- <router-link :to="{name:'shopcar'}"> -->
                <span class="gocar" @click="gopay">立即购买</span>
            <!-- </router-link> -->
            
            
            </h4>
        <div class="dianpu">
            <img src="http://cms.apppark.cn/app/upload/10656189/20171128153059_803.jpg" alt="" >
            <p>
                <b>人人茶馆</b><br>
                <b>全部商品:30</b>
            </p>
            <h5>
                <i class="iconfont">&#xe649;</i>
                <span>进入店铺</span>
            </h5>
        </div>
        <div class="shopimg">
            <h3>商品详情</h3>
            <img :src="news.image1" alt="">
            <img :src="news.image2" alt="">
            <img :src="news.image3" alt="">
        </div> 
           
    </div>

</template>

<script>
// import { Toast } from 'mint-ui';
import router from "../router";
import {Toast,MessageBox} from "mint-ui";
export default {
    data(){  return { news:null,shopId:null,price:null,title:null,img:null }    },
    methods:{
        addcar(){
           if(this.$router.nameId){
            this.$http.get("http://60.205.201.113:3500/shopcar",{
                params:{nameId:this.$router.nameId,id:this.news.id,title:this.news.title,price:this.news.price,imgrul:this.news.picPath,num:1}
                }).then(res=>{ Toast('加入购物车成功!'); })
            }else{ Toast('您还没登录,请登录');}
        },
        gopay(){
            if(this.$router.nameId){
                this.$http.get("http://60.205.201.113:3500/shopcar",{
                params:{nameId:this.$router.nameId,id:this.news.id,title:this.news.title,price:this.news.price,imgrul:this.news.picPath,num:1}
                }).then(res=>{this.$router.push({name:"shopcar"})  })
                
            }else{ Toast('您还没登录,请登录');}
        }
           
    },
    
   
    mounted(){
        this.$http.get("http://60.205.201.113:3500/home2",{
            params:{  id:this.$route.params.id    }
        }).then(res=>{   this.news = res.body[0];console.log(res.body[0]); Toast("数据请求成功")  })
    },
  beforeRouteEnter (to, from, next) {
        // ...
        next()
    },
    beforeRouteLeave (to, from, next) {
        next();
        // MessageBox.confirm('你确定要离开我们吗.....??').then(action => {
        //     console.log(action);
        //     if(action){
        //         next()
        //     }
        // });
        
    },
    beforeRouteUpdate(to, from, next){
        next()
    }
}
</script>
<style lang="scss">
    .section img{width:100%}
    .dianpu{width: 100%;overflow: hidden;}
    .dianpu img{width:1rem;height: 1rem;float: left;}
    .dianpu p{float: left;width:2rem;padding: 0.2rem}
    .price span{font-size:0.2rem;color:red}
    .iconfont{font-size: 0.4rem;}
    h2{color: #666;font-size:0.3rem}
    .dianpu h5{float: right;font-size:0.4rem;border: 1px solid #000;border-radius: 6px;padding:0.1rem;margin-top:0.1rem;margin-right:0.3rem;}
    .shopimg h3{height:0.5rem;line-height: 0.5rem;border-bottom:1px solid #aaa;margin:0.3rem}
    .car{font-size:0.3rem;padding:0.15rem;color:red}
    .addcar{display:inline-block;padding:0.1rem;border:1px solid #999;border-radius:6px; }
    .gocar{display:inline-block;padding:0.1rem;border:1px solid #999;border-radius:6px; }
</style>

