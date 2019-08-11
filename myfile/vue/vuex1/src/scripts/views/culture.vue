<template>
    <div class="box" v-if="show">
        <Head title="茶文化" ></Head>
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
            <ul class="list clearfix"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
            >
                <li v-for="(m,index) in mv" :key="index">
                    <router-link :to="{name:'detail',params:{id:m.id},query:{title:m.title}}">
                        <img v-lazy="m.picUrl" alt="">
                        <div class="detail">
                            <p style="color:red;font-size:16px">{{m.title}}</p>   
                            <p style="color:#666">作者:{{m.author}}</p>                     
                            <p style="color:#aaa;font-size:10px">日期:{{m.createTime}}</p>
                        </div>
                        
                    </router-link>
                </li>
            </ul>
        </mt-loadmore>
    </div>

</template>

<script>

import Display from "../components/display.vue";
import Counter from "../components/counter.vue";
import { Indicator ,Toast} from 'mint-ui';
export default { 
    data(){
        return {
            show:false,
            limit:8,
            mv:[],
            allLoaded:false,
            loading:false,
        }
    },
    methods:{
        loadTop(){
            console.log("loadTop");
            this.$http.get("http://60.205.201.113:3500/culture",{ params:{limit:this.limit+=4}

            }).then(res=>{
                setTimeout(()=>{
                    this.mv = res.body.reverse();
                    Toast('下拉刷新数据成功!');
                    this.$refs.loadmore.onTopLoaded();
                },1500)
            })
        },
        loadBottom(){
            console.log("loadBottom")
        },
        loadMore(){
            console.log("上拉loadmore");
            this.loading = true;
             this.$http.get("http://60.205.201.113:3500/culture",{
                 params:{limit:this.limit+=4
                 }
            }).then(res=>{
                setTimeout(()=>{
                    this.mv = this.mv.concat(res.body);
                    this.loading = false;
                    Toast('上拉加载更多数据成功!');
                },1500)
            })
        }
    },
    mounted(){
        Indicator.open({
            text: '努力加载中...',
            spinnerType: 'triple-bounce'
        });
        this.$http.get("http://60.205.201.113:3500/culture",{
            params:{
                limit:this.limit
            }
        }).then(res=>{
            setTimeout(()=>{
                this.mv = res.body;
                this.show = true;
                Indicator.close();
                Toast({
                    message: '请求成功',
                    iconClass: 'icon iconfont icon-fanhuidingbu',
                    duration:400
                });
            },100)
        })
    }
}
</script>


<style scoped>
Head{background: red}
.mint-search{ height:10vh;}
.tealist{margin-bottom:1rem;}
ul li{width: 100%;overflow: hidden;margin:0.2rem 0;padding: 0.1rem}
img{width:130px ! important;float: left;margin-right:0.2rem;}
.message{font-size:20px;width:500px;float: left;}
.detail{float: left;;text-align: left}
</style>
