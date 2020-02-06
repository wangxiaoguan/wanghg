<template>

    <div>
        <h2>{{msg}}</h2>      

        <p>{{$store.state.num}}</p>
        

    <button @click="$store.commit('jia')">+</button>

    <button @click="$store.commit('jian')">-</button>



    </div>

</template>

<script>

  import store from "../vuex/store";

    export default{

        data(){

            return{msg:'足球比赛', }

        },

        store,

        

    }

</script>