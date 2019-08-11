<template>
    <div class="box" v-if="show">
        <Head title="首页" ></Head>
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
            <ul class="list clearfix"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
            >
                <li v-for="(m,index) in mv" :key="index">
                    <router-link :to="{name:'detail',params:{id:m.id},query:{title:m.title}}">
                        <img v-lazy="m.images.large" alt="">
                        <p>{{m.title}}---{{m.year}}</p>
                    </router-link>
                </li>
            </ul>
        </mt-loadmore>

    </div>
</template>

<script>
import { Indicator ,Toast} from 'mint-ui';
export default {
    data(){
        return {
            show:false,
            mv:[],
            allLoaded:false,
            loading:false,
        }
    },
    methods:{
        loadTop(){
            console.log("loadTop");
            this.$http.get("http://47.94.208.182:3000/movie",{

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
             this.$http.get("http://47.94.208.182:3000/movie",{
                 params:{limit:4
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
        this.$http.get("http://47.94.208.182:3000/movie",{
            params:{
                limit:20
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

<style lang="scss" scoped>
    .list{
        width:100%;
       li{
           width:50%;
           float:left;
           height:300px;
           box-sizing: border-box;
           padding: 0 20px;
           margin-top:20px;
           a{
               display: block;
               width:100%;
               height:100%;
               border:1px solid #ddd;
               img{
                   width:100%;
                   height:200px;
               }
               p{
                   text-align: center;
                   line-height: 100px;
                   color:#000;
                   font-size:20px;
               }
           }
       }
    }
</style>
