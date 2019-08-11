<template>
    <div class="box">
        <!-- <Head title="用户" ></Head> -->
         <mt-header style="background: red" :title="title">
            
            <mt-button  slot="right" v-if="true" @click="gotoReg">注册</mt-button>
        </mt-header>
        <div class="userlogin">
            <i class="iconfont">&#xe657;</i>
             <mt-button v-if="show" size="small" type="primary" class="user" v-html="tag" plain @click="gotoLogin"></mt-button>
        </div>
        <img src="../../assets/images/a1.jpg" alt="">
        <h3>我的购物</h3>
        <ul class="mydetail">
           
            <li @click="goshopcar"><i class="iconfont">&#xe7bd;</i><span>{{item1}}</span></li>
            <li @click="goli(item2)"><i class="iconfont">&#xe615;</i><span >{{item2}}</span></li>
            <li @click="goli(item3)"><i class="iconfont">&#xe604;</i><span >{{item3}}</span></li>
            <li @click="goli(item4)"><i class="iconfont">&#xe60b;</i><span >{{item4}}</span></li>
        </ul>
         <h3>我的收藏</h3>
         <ul class="mycol">
             <li @click="goli(item5)"><i class="iconfont">&#xe6e2;</i><span>{{item5}}</span></li>
             <li @click="goli(item6)"><i class="iconfont">&#xe649;</i><span>{{item6}}</span></li>
             <li @click="goli(item7)"><i class="iconfont">&#xe7b8;</i><span>{{item7}}</span></li>
         </ul>
         <h3>我的茶吧</h3>
         <ul class="mybar" >
             <li @click="goli(item8)"><i class="iconfont">&#xe7b8;</i><span>{{item8}}</span></li>
             <li @click="goli(item9)"><i class="iconfont">&#xe616;</i><span>{{item9}}</span></li>
             <li @click="goli(item10)"><i class="iconfont">&#xe659;</i><span>{{item10}}</span></li>
             <li @click="goli(item11)"><i class="iconfont">&#xe643;</i><span>{{item11}}</span></li>
         </ul>
  
    </div>
</template>

    

<script>
import {mapState,mapActions} from "vuex";
import router from "../router";
export default {
    data(){return {
        userId:null,
        title:"用户",
        show:true,
        tag:"<span>未登录</span>"
        }},
    computed:{      ...mapState(['item1','item2','item3','item4','item5','item6','item7','item8','item9','item10','item11']) },
    methods:{
        gotoLogin(){  router.push({name:"login"}) },


        goli(arg){   

            if(!this.$router.nameId){ router.push({name:"login"})  
            }else{
                router.push({name:"item1",params:{itemname:arg}})
            }  
        
        },


        goshopcar(){
            if(!this.$router.nameId){ router.push({name:"login"})
            }else{  router.push({name:"shopcar"})       }
        },


         gotoReg(){router.push({name:"register"})},
    },
  mounted: function () {


      if(this.$router.nameId){
          this.$route.params.userId=this.userId;
          this.tag=" <i style='color:yellow;font-size:0.3rem' class='iconfont'>&#xe6c3;</i><span style='color:yellow;font-size:0.3rem'>"+this.$router.nameId+"</span>"
      }
      console.log(this.userId);
      

},

}
</script>
<style lang="scss" scoped>
    .user{background:#a00;color:#fff;height:0.6rem ! important;}
    .userlogin{position: absolute;top:160px}
    .userlogin .iconfont{font-size:80px;display:inline-block;width: 100px;height: 100px;background: rgb(233, 34, 34);
    border-radius:50%;text-align: center;color:rgb(25, 9, 248)}
    .box img{width: 100%;}
    .mydetail{width: 100%;overflow: hidden;margin:20px 0;color:#a6a}
    .mydetail li{float:left;width:150px;height: 100px;text-align: center}
    // .mydetail li .iconfont{font-size:0.4rem;}
    .mybar li{width:25%;float: left;height:80px;text-align:center;color: #050;margin-bottom: 1.3rem;}
    .mycol{margin:0.3rem 0;color:rgb(141, 92, 2);overflow: hidden;}
    .mycol li{width: 25%;float: left;text-align: center}
    .iconfont{display: block;width:0.7rem;height:0.7rem;font-size:0.7rem;margin: 0 auto;}
    // .mybar .iconfont{display: inline; font-size:40px;line-height:80px;}
    li:hover{color: red;}
    h3{padding:0.1rem;font-size:0.26rem;border-top:0.02rem solid #999;text-align: left}
</style>
