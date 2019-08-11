<template>
    <div class="section ">
        <Head title="注册" show="true"></Head>
        <div class="padding " style="margin-top:40px">
            <mt-field label="用户名" placeholder="请输入6-10位数字与字母" v-model="username"></mt-field>
            <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="phoneNum"></mt-field>
        <mt-field id="code" label="验证码" placeholder="请点击验证码" v-model="captcha" style="width:220px"></mt-field>
        <mt-button size="small" type="primary" v-on:click="sendSmsCode" v-model="btnContent" v-bind="{'disabled':disabled}" style="font-size:12px">{{btnContent}}</mt-button>
            <mt-field label="密　码" placeholder="请输入6-10位数字字母密码" type="password" v-model="password1"></mt-field>
            <mt-field label="密　码" placeholder="请再次输入密码" type="password" v-model="password2"></mt-field>
            <mt-button type="primary" size="large" class="m-10" @click="goRegister">注册</mt-button>
        </div>
       
 

    </div>
</template>
<script>
import {mapState,mapMutations} from "vuex";
import router from "../router";
 import { Toast } from 'mint-ui';
 export default {
  data(){
   return {
    username:"",//用户名
    phoneNum:"", //手机号
    verifyNum:"", //验证码
    btnContent:"获取验证码", //获取验证码按钮内文字
    time:0, //发送验证码间隔时间
    disabled:false, //按钮状态
    password1:"",
    password2:"",
    count:0,
    captcha:'',
    phoneCode:"",
    flag1:false,
    flag2:false,
    flag3:false,
    flag4:false,
  
    
   
   }
  },
  created(){ },
  methods:{

      goRegister(){
          var nameReg=/^[a-zA-Z0-9]{6,10}$/;
          var phonereg=/^1(3|5|6|7|8)[0-9]{9}$/;
          var pwdReg=/^[a-zA-Z0-9]{6,10}$/;
          if(nameReg.test(this.username)){this.flag1=true}else{Toast("请输入合法的用户名")};
          if(phonereg.test(this.phoneNum)){this.flag2=true}else{Toast("请输入合法的手机号")};
          if(nameReg.test(this.password1)){
              if(this.password1==this.password2){
                  this.flag3=true;
              }else{Toast("两次密码不一致,请重新输入")}
          }else{Toast("请输入合法的密码")};
          
          if(this.captcha==this.phoneCode){
              if(this.captcha){this.flag4=true}else{ Toast("验证码不能为空")};
          }else{ Toast("验证码错误!请重新输入")  }
          if(this.flag1&&this.flag2&&this.flag3&&this.flag4){
              this.$http.get("http://60.205.201.113:3500/goreg",{params:{ name:this.username,phone:this.phoneNum,pwd:this.password1 }
                        }).then(res=>{
                            this.$router.nameId=this.username;
                            if(res.body){this.$router.push({name:"mine",params: { userId:this.username}})                                
                            }else{ Toast("用户名或手机号已存在,请重新注册");  }
                           
                        })
             
          }

         
        

      },
   // 获取验证码
   sendSmsCode(){
    var reg=/^1(3|5|6|7|8)[0-9]{9}$/;//手机号正则验证
    var phoneNum = this.phoneNum;
    if(!phoneNum){Toast("请输入手机号码");return; }
    if(!reg.test(phoneNum)){ Toast("您输入的手机号码不合法，请重新输入");}
    this.time = 60;
    if(reg.test(phoneNum)){ 
        this.timer();
         this.$http.get("http://60.205.201.113:3500/code",{
                params:{phone:phoneNum}
                }).then(res=>{
                    
                    this.phoneCode=res.body.code
                     })
        }

   },
   timer(){
    if(this.time>0){
     this.time--;
     this.btnContent = this.time+"s后重新获取";
     this.disabled = true;
     var timer = setTimeout(this.timer,1000);
    }else if(this.time == 0){
     this.btnContent = "获取验证码";
     clearTimeout(timer);
     this.disabled = false;
    }
   },
  

  }
 }

</script>

<style>
    .padding{
        box-sizing: border-box;
        padding: 10px; /*no*/
    }
    .m-10{
        margin-top:10px;/*no*/
    }
    #code{display:inline-block;vertical-align:middle}
</style>
