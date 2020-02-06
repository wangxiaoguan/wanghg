<template>
    <div class="box" v-if="show">
        <Head title="商品" ></Head>

        <mt-search v-model="value"  cancel-text="取消" style="width:80%;display:inline-block;vertical-align:top" placeholder="搜索">

        </mt-search><mt-button size="normal" @click="search" type="primary" style="width:20%;display:inline-block;vertical-align:top;height:53px">搜索</mt-button>

        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
        <ul class="goods clearfix" v-infinite-scroll="loadMore"  infinite-scroll-disabled="loading" infinite-scroll-distance="10">

             <li  v-for="(list,index) in lists" :key="index">
                <router-link  :to="{name:'goodsdetail',params:{id:list.id},query:{id:list.id}}">
                <img :src="list.picPath" alt="">
                <p >{{list.title}}</p>
                <h3 style="color:red">￥{{list.price}}</h3>
                <h3>已出售<span>{{list.soldCount}}</span>件</h3>
                </router-link>
            </li>
        </ul>
        </mt-loadmore>

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

import Display from "../components/display.vue";
import Counter from "../components/counter.vue";
import { Indicator ,Toast} from 'mint-ui';
export default { 
    data(){    return {show:false, value:"",lists:[], allLoaded:false, loading:false,limit:8}  },
        methods:{
        search(){
            var word=this.value;
            console.log(word);
            this.$http.get("http://60.205.201.113:3500/search",{ params:{msg:word}
        }).then(res=>{
            console.log(res.body);
            this.lists = res.body;
        })

        },
        loadTop(){
            console.log("loadTop");
            this.$http.get("http://60.205.201.113:3500/home2",{params:{ limit:this.limit+=4 }
            }).then(res=>{
                setTimeout(()=>{
                    this.lists = res.body.reverse();
                    Toast('下拉刷新数据成功!');
                    this.$refs.loadmore.onTopLoaded();
                },1500)
            })
        },
        loadBottom(){console.log("loadBottom")},
        loadMore(){
            console.log("上拉loadmore");
            this.loading = true;
             this.$http.get("http://60.205.201.113:3500/home2",{params:{ limit:this.limit+=4 }
            }).then(res=>{
                setTimeout(()=>{
                    this.lists = this.lists.concat(res.body);
                    this.loading = false;
                    Toast('上拉加载更多数据成功!');
                },1500)
            })
        }
    },
    // mounted(){
    //     // Indicator.open({
    //     //     text: '加载中...',
    //     //     spinnerType: 'triple-bounce'
    //     // });

    //     this.$http.get("http://60.205.201.113:3500/home1",{
    //         params:{limit:8 }
    //     }).then(res=>{
    //         console.log(res.body);
    //         setTimeout(()=>{
    //             this.lists = res.body;
    //             // Indicator.close();
    //         },1200)
    //     })

        
    // },
     mounted(){
        Indicator.open({
            text: '努力加载中...',
            spinnerType: 'triple-bounce',
                  });

        this.$http.get("http://60.205.201.113:3500/home2",{ params:{limit:8 }
        }).then(res=>{
            console.log(res.body);
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
    },
    components:{
        Display,
        Counter
    }
}
</script>


<style scoped>
Head{background: red}
.mint-search{ height:10vh;}

.goods li{float: left;;width:45%;overflow: hidden;margin-left:5%;padding:0.2rem 0}
.goods li img{width:100%;height:2.4rem;}
.goods li p{font-size:0.2rem;height:0.8rem;}
/* .tealist{margin-bottom:1rem;}
ul li{width: 100%;overflow: hidden;}
img{width:130px ! important;float: left;}
.message{font-size:20px;width:500px;float: left;} */
</style>
