<template>
    <div class="section ">
        <mt-header style="background: red" :title="title">
        <mt-button icon="back" slot="left" @click="goback" v-if="true" >返回</mt-button>
        <mt-button  slot="right" v-if="true" @click="gotoReg">注册</mt-button>
    </mt-header>
        <div class="padding "  v-if="!show">
            <mt-field label="账　号" placeholder="请输入用户名/手机号" type="text" v-model="username" ></mt-field>
            <mt-field label="密　码" placeholder="请输入密码" type="password" v-model="password"></mt-field>
            <mt-button type="primary" size="large" plain class="m-10" @click="goLogin">登录</mt-button>
 
        </div>
        <div class="padding" v-if="show">
           <h1><span class="span1">用户名:</span><span class="span2">{{name}}</span></h1>
           <h1><span class="span1">会员级别:</span><span class="span2">Lv1</span></h1>
           <h1><span class="span1">优惠劵:</span><span class="span2">无</span></h1>
            <mt-button type="primary" size="large" plain class="m-10" @click="goquit">注销</mt-button>
      
        </div>
 
 

    </div>
</template>
<script>
import {mapState,mapMutations} from "vuex";
import router from "../router";
import { Toast,Indicator } from 'mint-ui';


export default {
    data(){ return {username:"",password:"",name:this.$router.nameId,show:false}  },
    computed:{
        ...mapState(['username']),
        phone:{
            get(){ return this.$store.state.phone; },
            set(newval){// this.$store.commit("updatePhone",newval)
                 this.updatePhone(newval)
            }
        },

    },
      
    methods:{
        
        ...mapMutations({updateUsername:"getUsername" }),
        ...mapMutations(['updatePhone']),
        getUsername(e){console.log(e); this.$store.commit("getUsername",e); },
          gotoReg(){
            // this.$router.push("")
            router.push({name:"register"})
        },
        goback(){
            console.log(this.$router);
            // this.$router.go(-1);
            router.go(-1);
        },
        goquit(){
            this.$router.nameId=false;
            this.$router.push({name:"mine"})
        },

        goLogin(){
            if(this.username){
                if(this.password){
                     this.$http.get("http://60.205.201.113:3500/gologin",{params:{ name:this.username,pwd:this.password }
                        }).then(res=>{
                            if(res.body.length){
                                this.$router.nameId=this.username;
                                 Indicator.open({  text: '登录中...', spinnerType: 'triple-bounce' });
                                setTimeout(()=>{
                                    Indicator.close();
                                    this.$router.push({name:"mine",params: { userId:this.username}});
                                     
                                },1200)
                                
                            
                            }else{
                               Toast("用户名不存在或密码错误,请重新登录"); 
                              
                            }
                            
                        })

                }else{ Toast("请输入密码");};

            }else{Toast("请输入用户名");return; };

            


            
           
        }
    },
    mounted(){
        
        if(this.$router.nameId){ this.show=true; }
    }

}
</script>

<style>
    .padding{ box-sizing: border-box;  padding: 10px; /*no*/ }
    .m-10{ margin-top:10px;/*no*/  }
    .padding h1{width: 100%;overflow: hidden;}
    .span1{float: left;width:2rem;font-size:0.3rem;}
    .span2{float: left;font-size:0.3rem;text-align: left;color:red }
</style>
