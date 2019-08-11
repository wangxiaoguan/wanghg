<template>
    <div class="box">
        <Head title="茶文化" ></Head>
        <div class="cul_search" style="margin-top:40px">
            <input type="text" v-model="value" class="mysearch"><mt-button size="normal" class="mybutton" @click="search" type="primary" >搜索</mt-button>
        </div>

        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
            <ul class="list clearfix"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
            >
                <li class="enter2" v-for="(m,index) in teas" :key="index">
                    <router-link :to="{name:'detail',params:{id:m.id},query:{title:m.title}}">
                        <img v-lazy="m.picUrl" alt="">
                        <div class="detail">
                            <p class="detail_p1" style="">{{m.title}}</p>   
                            <p class="detail_p2" style="">作者:{{m.author}}</p>                     
                            <p class="detail_p3" style="">日期:{{m.createTime}}</p>
                        </div>
                        
                    </router-link>
                </li>
            </ul>
        </mt-loadmore>
    </div>

</template>

<script>


import { Indicator ,Toast} from 'mint-ui';
import {mapState,mapActions} from "vuex";
import store from '../vuex/store';
export default { 
    data(){
        return {
            show:false,
            limit:8,
          
            allLoaded:false,
            loading:false,
            value:"",
        }
    },
    methods:{

         ...mapActions(['gettea']),
          search(){   
            Indicator.open({ text: '努力加载中...', spinnerType: 'triple-bounce' });       
            var word=this.value;
            this.$http.get("http://60.205.201.113:3500/search2",{ params:{msg:word}
            }).then(res=>{
                setTimeout(()=>{
                    if(res.body.length){
                         Indicator.close();
                        store.state.teas = res.body;
                    }else{
                        Indicator.close();
                        Toast("很抱歉,没有找到,稍后会更新")
                        store.state.teas = res.body;
                    }
                },1500)
             })
        },

    },
    mounted(){
        Indicator.open({ text: '努力加载中...', spinnerType: 'triple-bounce' });

        this.gettea({url:"/culture"},{params:{limit:100 }});





    },
       
    
  
 
    computed:{     ...mapState(['teas'])   },
}
</script>


<style scoped>
Head{background: red}
.mysearch{width:78%;display:inline-block;vertical-align:top;overflow: hidden;height:0.41rem;
border:0.06rem solid #47fcde}
.mybutton{width:20%;display:inline-block;vertical-align:top;overflow: hidden;height:0.53rem;border-radius:0px;background: #47fcde}
.mint-search{ height:10vh;}
.list{margin-bottom:1.2rem;}
ul li{width: 100%;overflow: hidden;margin:0.2rem 0;padding: 0.1rem;border-bottom:0.02rem solid #aaa;background: rgb(248, 226, 248)}
img{width:130px ! important;float: left;margin-right:0.2rem;}
.message{font-size:20px;width:500px;float: left;}
.detail{float: left;;text-align: left}
.detail_p1{color:red;font-size:0.3rem}
.detail_p2{color:#666}
.detail_p3{color:#aaa;font-size:0.2rem}
.cul_search{width: 100%;overflow: hidden;}
</style>
