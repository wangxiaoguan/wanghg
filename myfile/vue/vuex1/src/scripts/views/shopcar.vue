<template>
    <div id="box" class="box" v-if="show">
        <Head title="购物车" show="true"></Head>
        <h1><span class="h1_span1">自营</span><span class="h1_span2">会员优惠</span></h1>
        <!-- <ul class="shopcar">
            <li v-for="(good,index) in cars" :key="index">
                <input class="inputbox" type="checkbox" >
                 <img :src="good.imgrul" alt="">
                <div>
                    <h2>{{good.title}}</h2>
                    <h2><span style="color:red;font-size:18px">￥{{good.price}}</span>
                    <p id="reckon">

                        <<span class="red" @click="reduce">-</span>
                        <span class="count" v-text="num"></span>
                        <span class="add" @click="add">+</span> -->
                    <!-- </p> -->
                    
                    <!-- </h2> -->
                <!-- </div> -->
            <!-- </li> -->
        <!-- </ul>  -->

         <table>
           
            <tr class="goods_tr" v-for="(good,index) in goods" :key="index">
                <td class="goods_td" style="font-size:12px">{{good.title}}</td>
            
                <td><input class="checkbox" type="checkbox" v-model="good.check"><img class="td_img" style="width:100px;vertical-align:middle;" :src="good.imgrul" alt=""></td>
                
                <td class="td_price" style="color:red">￥{{good.price}}</td>
                <!-- <td><button @click="good.num>1?good.num--:good.num=1">-</button><button>{{good.num}}</button><button @click="good.num++">+</button></td> -->
                 <td><button @click="reduce(index,good.num,good.id)">-</button><button>{{good.num}}</button><button @click="add(index,good.num,good.id)">+</button></td>
                <td class="td_total">{{good.price*good.num}}</td>
                <!-- <td class="delete"><button   @click="goods.splice(index,1)">删除</button></td> -->
                 <td class="delete"><button   @click="detele(index,good.id)">删除</button></td>
            </tr>            
        </table>
       <footer id="footer">
           <label for="checkall">全选</label>
           <input type="checkbox" id="checkall"   v-model="checkall">
           <p> 总价￥<span class="total" ref="span">{{total}}</span><span class="pay" @click="pay">立即结算</span> </p>
       </footer>
       <div id="payimg" v-if="show2">
           <img   src="../../assets/images/a7.jpg" alt="">
           <p><span @click="cancel">取消</span></p>
       </div>
       
       
        
    </div>

</template>

<script>

// import Display from "../components/display.vue";
// import Counter from "../components/counter.vue";
import { Indicator ,Toast} from 'mint-ui';
import Vue  from 'vue';

export default { 
    data(){    return {
        show:true, 
        value:"1803",
        goods:[], 
        allLoaded:false, 
        loading:false,limit:8,
        num:2,
        show2:false,     
        }  
    },
    
    methods:{
        detele(index,id){
            this.goods.splice(index,1);
            console.log(id);
            this.$http.get("http://60.205.201.113:3500/detele",{params:{id:id,nameId:this.$router.nameId  }
        }).then(res=>{ })
        },
        add(index,num,id){
            this.goods[index].num=this.goods[index].num*1+1;
            var sum=this.goods[index].num;
            console.log(sum);
             this.$http.get("http://60.205.201.113:3500/updatenum",{params:{id:id,nameId:this.$router.nameId,num:sum }
        }).then(res=>{ })
        },
        reduce(index,num,id){         
            this.goods[index].num=this.goods[index].num>1?(this.goods[index].num*1-1):1;
             var sum=this.goods[index].num;
            console.log(sum);
            this.$http.get("http://60.205.201.113:3500/updatenum",{params:{id:id,nameId:this.$router.nameId,num:sum }
        }).then(res=>{ })
        },
        cancel(){this.show2=false},
        pay(){
            if(this.$refs.span.innerHTML!=0){
                 this.show2=true
                console.log(this.$refs.span.innerHTML)
            }else{Toast("您还没选择商品")}
           
            }
    },  
     computed:{
                    checkall:{
                        get(){
                            var flag=true;
                            this.goods.forEach((good)=>{
                                if(!good.check){flag=false;}
                            })
                            return flag;
                        },
                        set(val){
                            var arr=this.goods.map((good)=>{
                                good.check=val;
                                return good;
                            })
                            this.goods=arr;
                        }
                    },
                    total:{
                        get(){
                            var total=0;
                            this.goods.forEach((good)=>{
                                if(good.check){
                                    total+=good.price*good.num
                                }
                                
                            })
                            return total;
                        }
                    }
                },
  
    mounted(){

        this.$http.get("http://60.205.201.113:3500/goodscar",{
            params:{limit:100,nameId:this.$router.nameId }
        }).then(res=>{
            console.log(res.body);
            setTimeout(()=>{
                this.goods = res.body;
                // Indicator.close();
            },1200)
        }),
         this.goods.forEach((good)=>{
                    if(good.check){
                        this.total+=good.price*good.num;
                    }
                })

        
    }
 
    
}

</script>


<style scoped lang="css">
Head{background: red}
table{margin-bottom:1rem}
h1{padding:0.1rem;background: rgb(245, 242, 217);overflow: hidden;}
.h1_span1{float: left;font-size:0.26rem;}
.h1_span2{float: right;} 
#footer{width:100%;padding:0.15rem;position: fixed;bottom:0;left: 0;background: rgb(149, 246, 253)}
#footer p{float: right;margin-right:0.3rem;}
#footer p .pay{display: inline-block;padding:0.1rem;background: red;border-radius:10px;color:#fff}
.total{display: inline-block;width:1.5rem;}
/* ///////////////购物车加减////////////////// */
#payimg{position: fixed;top: 0;left: 0;right: 0;bottom: 0;margin: auto;width:4rem;height:5rem}
#payimg img{width:4rem;height:5rem;}
#payimg p{position: absolute;bottom:0 ;width:100%}
#payimg span{padding:0.1rem;float: right;background:red;color: #fff}
.checkbox{display: inline-block;margin-top:0.7rem;}
.td_img{float: right;}
.goods_tr{position: relative;overflow: hidden;}
.goods_td{position: absolute;width: 450px;right: 0;}
.td_price{width: 1rem;}
.td_total{width:1rem;text-align:center;} 

</style>
