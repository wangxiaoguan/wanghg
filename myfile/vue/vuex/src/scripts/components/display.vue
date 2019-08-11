<template>
    <div>
        <h2>计数器 展示  组件  -- display</h2>
        <h2>count === <mt-badge size="large " type="error">{{count}}</mt-badge></h2>
        <p><mt-badge size="large " type="error">{{n1}}</mt-badge></p>
        <p><mt-badge size="large " type="success">{{n2}}</mt-badge></p>
        <p><mt-badge size="large " type="success">{{number}}</mt-badge></p>
        <p><mt-badge size="large " type="success">{{n3}}---{{n4}}---{{n5}}</mt-badge></p>
        <p><mt-badge size="large " type="error">{{city}}</mt-badge></p>
        <p><mt-badge size="large " type="error">{{msg}}</mt-badge></p>
        <p><mt-badge size="large " type="error">{{obj.username}}</mt-badge></p>
        <p><mt-badge size="large " type="success">{{data}}</mt-badge></p>

    </div>
</template>

<script>
import bus from "./bus";
import store from "../vuex/store";
console.log(store.state.number);
console.log(store.state);
console.log(store);


// a=>a
// a=>{return a }
import {mapState} from "vuex";  // mapState 方便获取state 


export default {
    data(){
        return {
            count:1803,
            n1:store.state.number,
            n2:this.$store.state.number
        }
    },
    // computed:{
    //     n3(){return this.$store.state.number }  //  store.state.number }
    // },
    // computed:mapState({
    //     n3:state=>state.number+3,
    //     n4:'number',
    //     n5(state){
    //         return state.number + 5
    //     },
    // }),
    // computed:mapState([
    //     'number'
    // ]),
    computed:{
        n3:state=>state.number+3,//n3(state){return state.number+3 }
       
        ...mapState({
            n4:'number',
            n5(state){  return state.number + 5 },
        }),
        ...mapState(['number','city','msg', 'obj', "data"])
    },
    created() {
        
        bus.$on("count-add",num=>{
            this.count += num;
        })
        bus.$on("count-desc",num=>{
            this.count -= num;
        })
    },
}
</script>

