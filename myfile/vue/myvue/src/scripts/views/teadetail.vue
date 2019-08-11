<template>
    <div class="section">
        <Head :title="tea.title" show="true"></Head>
        <h2 style="margin-top:40px">{{tea.title}}</h2>
        <img src="../../assets/images/a2.png" alt="">
        <img :src="tea.detailUrl" alt="">
        <h5>{{tea.content}}</h5>
        <h5>{{tea.content2}}</h5>
        <h4>总评:{{tea.summary}}</h4>
        <img src="../../assets/images/a4.png" alt="">
        <p>时间:<span style="color:red">60s</span>温度:　<span style="color:red">100℃</span></p>
        <h3>{{tea.first}}</h3>

    </div>

</template>

<script>
import {Toast,MessageBox} from "mint-ui";
export default {
    data(){  return { tea:null }    },
    mounted(){
        this.$http.get("http://60.205.201.113:3500/home1",{
            params:{  id:this.$route.params.id    }
        }).then(res=>{   this.tea = res.body[0]; Toast("数据请求成功")  })
    },

}
</script>
<style lang="scss">
    .section img{width:100%}
    h2{padding:0.2rem 0.1rem;font-size:0.3rem}
    h5{padding:0.1rem;color: rgb(61, 27, 24)}
    h4{padding:0.1rem;color:#a6a}
    p{font-size:0.3rem;padding:0.1rem}
    h3{padding:0.1rem;font-size:0.3rem;;color:rgb(19, 43, 19)}
</style>

