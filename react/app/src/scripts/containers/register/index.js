

import React,{Component} from "react";
import axios from "axios";
import "./index.scss";

import { Toast,List, InputItem, WhiteSpace,WingBlank,Button,NavBar,Icon  } from 'antd-mobile';

export class Register extends Component{
    state={phone:null,name:null,pwd:null,code:NaN,time:null,
        flag1:false,flag2:false,flag3:false,flag4:false,flag5:false,}
    regUser=(value)=>{
        const reg1=/^[0-9a-zA-Z]{6,10}$/;
        if(reg1.test(value)){this.setState({name:value,flag1:true });Toast.info('用户名合法', 1); }
        else{this.setState({name:value,flag1:false }); }
    }
    regPhone=(value)=>{
        const reg2=/^1(3|5|6|7|8){1}[0-9]{9}$/;
        if(reg2.test(value)){
            Toast.info('手机号正确', 1);
            this.setState({phone:value,flag2:true });
        }else{ this.setState({phone:value,flag2:false }); }
    }
    sendCode=()=>{
         if(this.state.flag2){
            this.state.time=60;
            this.timer();
            Toast.loading("发送中...",2);
        axios.get("http://60.205.201.113:8000/code?phone="+this.state.phone)
        .then(res=>{Toast.info("发送成功!",1);
                this.state.code=res.data.code;
        }) 
         }else{Toast.info('请输入正确的手机号', 1);}    
    }
    regCode=(value)=>{
        if(value==this.state.code){
            Toast.info('验证码正确', 1);
            this.state.flag3=true;
        }else{this.state.flag3=false;}
    }

    regPwd=(value)=>{
        const reg3=/^[0-9a-zA-Z]{6,10}$/;
        if(reg3.test(value)){Toast.info('密码合法', 1);
            this.setState({pwd:value,flag4:true });
         }else{this.setState({pwd:value,flag4:false });}
    }
    regPwd2=(value)=>{
        if(value==this.state.pwd){this.state.flag5=true; }
        else{this.state.flag5=false;}
    }
    goReg=()=>{
        Toast.loading("注册中...",2);
        const {history} = this.props;
        if(this.state.flag1){
            if(this.state.flag3){
                if(this.state.flag4){
                    if(!this.state.flag5){Toast.info("密码不一致",1);}
                }else{Toast.info("密码不合法",1);}
            }else{Toast.info("验证码不正确",1);}
        }else{Toast.info("用户名不合法",1);}
        if(this.state.flag1&&this.state.flag2&&this.state.flag3&&this.state.flag4&&this.state.flag5){
       axios.get("http://60.205.201.113:8000/register",
       {params:{name:this.state.name,phone:this.state.phone,pwd:this.state.pwd}})
        .then(res=>{
            if(res.data){Toast.info("注册成功!",1);
            sessionStorage.name=this.state.name;
            history.push("/app/mine");            
            }else{Toast.info("用户名或手机号已注册",1);}
            }) 
        }else{Toast.info("注册失败",1);}
    }
    timer=()=>{
        if(this.state.time>0){
         this.state.time--;
         this.getCode.innerHTML = this.state.time+"s后重新获取";
         this.getCode.disabled=true;
         var timer = setTimeout(this.timer,1000);
        }else if(this.state.time == 0){
         this.getCode.innerHTML = "获取验证码";
         clearTimeout(timer);
         this.getCode.disabled = false;
        }
       }


    goback=()=>{ const {history} = this.props;history.goBack();}

    render(){
        return (
            <div id="register">
    
                <NavBar
                        mode="dark"
                        style={{backgroundColor:"red"}}
                        icon={<Icon type="left" />}
                        leftContent={"返回"}
                        onLeftClick={this.goback}
                        >{"注册"}</NavBar>
               
                <List style={{marginTop:50}}>
                    <WingBlank>
                    <WhiteSpace size="lg"/>
                    <InputItem  clear placeholder="请输入6-10位数字与字母"  onChange={(value)=>this.regUser(value)} >用户名</InputItem>
                    <WhiteSpace size="lg"/>
                    <InputItem  clear placeholder="请输入手机号" ref={el=>this.phone=el}  onChange={(value)=>this.regPhone(value)} >手机号</InputItem>
                    <WhiteSpace size="lg"/>
                    <InputItem clear placeholder="请输入验证码" onChange={(value)=>this.regCode(value)}>验证码</InputItem>
                    <button  onClick={this.sendCode} className="btncode" style={{ position: "absolute", right:20,top:140}} ref={el=>this.getCode=el}
                    >获取验证码</button>
                    <WhiteSpace size="lg"/>
                    <InputItem type="password" clear placeholder="请输入6-10位数字与字母"  onChange={(value)=>{this.regPwd(value)}}>密　码</InputItem>
                    <WhiteSpace size="lg"/>
                    <InputItem  type="password" clear placeholder="请再次输入密码"  onChange={(value5)=>{this.regPwd2(value5)}} >密　码</InputItem>
                    <WhiteSpace size="lg"/>
                    <Button type="primary"  size="large" onClick={this.goReg}>注册</Button>
                    </WingBlank>
                </List>
                <ul className="reg_icon">
                    <li><img src="http://wanghg.top/images/wx.png" alt=""/></li>
                    <li><img src="http://wanghg.top/images/qq.png" alt=""/></li>
                    <li><img src="http://wanghg.top/images/wb.png" alt=""/></li>
                </ul>
                
            </div>
        )
    }
}
