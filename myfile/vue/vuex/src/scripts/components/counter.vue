<template>
    <div>
        <h2>===============counter </h2>
        <mt-button type="primary" @click="countadd">count++</mt-button>
        <mt-button type="primary" @click="countdesc">count--</mt-button>
        <mt-button type="primary" @click="increment">increment</mt-button>  
        <mt-button type="primary" @click="add">add</mt-button>
        <mt-button type="primary" @click="desc">decrement</mt-button>
        <mt-button type="primary" @click="countadd1">countadd1 100</mt-button>
        <mt-button type="primary" @click="countadd(1000)">countadd</mt-button>
        <mt-button type="primary" @click="changeCity('深圳')">修改你喜欢城市</mt-button>
        <mt-button type="primary" @click="changeMsg({msg:'1803 daydayup'})">修改msg </mt-button>
        <mt-button type="primary" @click="changeUsername({username:'zuzouozmumu'})">修改username </mt-button>
        <mt-button type="primary" @click="changeData({url:'/getdata/123',id:1803})">获取异步数据 data </mt-button>

    </div>
</template>

<script>
import bus from './bus'
import store from "../vuex/store";
import {mapActions} from "vuex";

export default {
    data(){ return { } },
    methods:{
        countadd:function(){ bus.$emit("count-add",10);  },
        countdesc(){ bus.$emit("count-desc",100);    },

        
        increment2(){
            store.dispatch("increment");  // dispatch action
            // this.$store.dispatch("increment")
        },
        desc(){  this.$store.dispatch("decrement")    },
        countadd1(){    store.dispatch("countadd",100);   },
        change(e){    console.log(e.target.value);  },
        ...mapActions({  add:"increment",    }),
        ...mapActions([
            'increment',
            'countadd',  // this.store.dispatch('increment')
            'changeCity',  // store.dispatch("changeCity",'深圳')
            'changeMsg',
            "changeUsername",
            "changeData"
        ])
    }
}
</script>
