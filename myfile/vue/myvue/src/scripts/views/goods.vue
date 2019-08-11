<template>
    <div class="box">
        <Head title="商品" ></Head> 
            <div class="good_search" style="margin:40px 0 5px">
            <input type="text" v-model="value" class="mysearch"><mt-button size="normal" class="mybutton" @click="search" type="primary" >搜索</mt-button>
            </div>          
            <ul class="goods ">
             <li class="enter" v-for="(list,index) in lists" :key="index">
                <router-link  :to="{name:'goodsdetail',params:{id:list.id},query:{id:list.id}}">
                <img :src="list.picPath" alt="">
                <p >{{list.title}}</p>
                <h3 style="color:red">￥{{list.price}}</h3>
                <h3>已出售<span>{{list.soldCount}}</span>件</h3>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>


import { Indicator ,Toast} from 'mint-ui';
import {mapState,mapActions} from "vuex";
import store from '../vuex/store';


export default { 

    data(){    return { value:"" }  },

    methods:{  

         ...mapActions(['getgoods']),

        search(){   
            Indicator.open({ text: '努力加载中...', spinnerType: 'triple-bounce' });          
            var word=this.value;
            this.$http.get("http://60.205.201.113:3500/search",{ params:{msg:word}
            }).then(res=>{ 
                setTimeout(()=>{
                    if(res.body.length){
                         Indicator.close();
                        store.state.lists = res.body;
                    }else{
                        Indicator.close();
                        Toast("很抱歉,没有找到,稍后会更新")
                        store.state.lists = res.body;
                    }
                   
                },1500)
                
                
            })
        },
    }, 

    mounted(){
         
       Indicator.open({ text: '加载中...', spinnerType: 'triple-bounce' }), 

       this.getgoods();    
           
    },


    computed:{     ...mapState(['lists'])   },
   
 
}
</script>


<style scoped>
Head{background: red}
.mysearch{width:78%;display:inline-block;vertical-align:top;overflow: hidden;height:0.41rem;
border:0.06rem solid #26a2ff}
.mybutton{width:20%;display:inline-block;vertical-align:top;overflow: hidden;height:0.53rem;border-radius:0px}
.mint-search{ height:10vh;}
.goods{width: 100%;overflow: hidden;margin-bottom:1.1rem;}
.goods li{float:left;;width:45%;overflow:hidden;margin-left:3%;padding:0.2rem 0;border:1px solid #aaa;margin-bottom:0.1rem;}
.goods li img{width:100%;height:2.4rem;}
.goods li p{font-size:0.2rem;height:0.8rem;}

.mint-search-list{display:none ! important}
.good_search{width: 100%;overflow: hidden;}
</style>
