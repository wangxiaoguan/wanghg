<template>
    <div class="box">
        <Head title="我" ></Head>
        <!-- <mt-button type="default">default</mt-button> -->
        <!-- <mt-button type="primary">primary</mt-button> -->
        <!-- <mt-button type="danger" size="large" >danger</mt-button> -->
        <!-- <mt-button size="small">small</mt-button> -->
        <!-- <mt-button size="large" type="primary" plain @click="gotoLogin">进入登录</mt-button> -->
        <!-- <mt-button size="normal">normal</mt-button> -->
        <div class="userlogin">
            <i class="iconfont">&#xe657;</i>
             <mt-button v-if="show" size="small" type="primary" v-html="tag" plain @click="gotoLogin"></mt-button>
            <!-- <router-link :to="{name:'login'}">
                    <span>未登录</span>
            </router-link> -->
        </div>
        <img src="../../assets/images/a1.jpg" alt="">
        <h3>我的购物</h3>
        <ul class="mydetail">
            <li @click="goli"><i class="iconfont">&#xe614;</i><span>待付款</span></li>
            <li @click="goli"><i class="iconfont">&#xe603;</i><span>待发货</span></li>
            <li @click="goli"><i class="iconfont">&#xe604;</i><span>待收货</span></li>
            <li @click="goli"><i class="iconfont">&#xe60b;</i><span>待评价</span></li>
            <li @click="goli"><i class="iconfont">&#xe602;</i><span>退款</span></li>
            <!-- <router-link :to="{name:'shopcar'}"> -->
            <li @click="goshopcar"><i class="iconfont">&#xe7bd;</i><span>购物车</span></li>
            <!-- </router-link> -->
            <li @click="goli"><i class="iconfont">&#xe616;</i><span>浏览记录</span></li>
            <li @click="goli"><i class="iconfont">&#xe615;</i><span>收货地址</span></li>
        </ul>
         <h3>我的贴吧</h3>
         <ul class="mybar">
             <li @click="goli"><i class="iconfont">&#xe7b8;</i><span>我的帖子</span></li>
             <li @click="goli"><i class="iconfont">&#xe616;</i><span>浏览记录</span></li>
             <li @click="goli"><i class="iconfont">&#xe659;</i><span>帖子收藏</span></li>
             <li @click="goli"><i class="iconfont">&#xe643;</i><span>贴吧消息</span></li>
         </ul>
         <h3>我的收藏</h3>
         <ul class="mycol">
             <li @click="goli"><i class="iconfont">&#xe6e2;</i><span>商品</span></li>
             <li @click="goli"><i class="iconfont">&#xe649;</i><span>店铺</span></li>
             <li @click="goli"><i class="iconfont">&#xe7b8;</i><span>帖子</span></li>
         </ul>
        <span style='color:red;font-size:0.2rem'></span>
    </div>
</template>

<script>
import router from "../router";
export default {
    data(){return {
        userId:null,
        show:true,
        tag:"<span>未登录</span>"
        }},
    methods:{
        gotoLogin(){
            // this.$router.push("")
            router.push({name:"login"})
        },
        goli(){
            if(!this.$router.nameId){
                router.push({name:"login"})
            }
        },
        goshopcar(){
            if(!this.$router.nameId){
                router.push({name:"login"})
            }else{
                router.push({name:"shopcar"})
            }
        }
    },
  mounted: function () {
    //   console.log(this.$route.params);
    //   console.log(this.$router.nameId);
    //   this.userId = this.$route.params.userId;

      if(this.$router.nameId){
          this.$route.params.userId=this.userId;
          this.tag=" <i style='color:yellow' class='iconfont'>&#xe657;</i><span style='color:red;font-size:0.2rem'>"+this.$router.nameId+"</span>"
      }
      console.log(this.userId);

},

}
</script>
<style lang="scss" scoped>
    .userlogin{position: absolute;top:160px}
    .userlogin .iconfont{font-size:80px;display:inline-block;width: 100px;height: 100px;background: rgb(233, 34, 34);
    border-radius:50%;text-align: center;color:rgb(25, 9, 248)}
    .box img{width: 100%;}
    .mydetail{width: 100%;overflow: hidden;margin:20px 0}
    .mydetail li{float: left;width:150px;height: 100px;;font-size:20px;text-align: center}
    .mybar li{width: 50%;float: left;height:80px;text-align:center;}
    .mycol{margin-top:30px;}
    .mycol li{width: 25%;float: left;text-align: center}
    .iconfont{display: block;width: 60px;height: 60px;;font-size: 40px;margin: 0 auto;}
    .mybar .iconfont{display: inline; font-size:40px;line-height:80px;}
    li:hover{color: red}
    h3{padding:0.1rem;font-size:0.26rem;}
</style>
