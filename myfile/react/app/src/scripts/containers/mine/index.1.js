

import React,{Component} from "react";

import { List } from 'antd-mobile';

import axios from "axios";

const Item = List.Item;
const Brief = Item.Brief;
import "./index.scss";
import {Head} from "../../components/head";
import { WingBlank, WhiteSpace ,Button,  Modal,ActionSheet,NavBar,Icon,Toast  } from 'antd-mobile';

const alert = Modal.alert;
const prompt = Modal.prompt;
import loginImg1 from "./login.jpg";
import loginImg2 from "./head.png";





export class Mine extends Component{
    state = {clicked:0}
    componentDidMount(){
        if(sessionStorage.name){
            this.span.innerHTML=sessionStorage.name
        }
    }

 
      showAlert = () => {
       
        const alertInstance = alert('您确定退出当前账号吗?','', [
          { text: '取消',style: 'default' , onPress: () => {} },
          { text: '退出', onPress: () =>{sessionStorage.name="";this.span.innerHTML="登录"
          } },
        ]);
        setTimeout(() => {
    
          console.log('auto close');
          alertInstance.close();
        }, 500000);
      };
      show = () => prompt(
        '登录','',
        (login, password) =>{
            axios.get("http://60.205.201.113:8000/login",
            {params:{phone:login,pwd:password}})
             .then(res=>{
                 console.log(res.data);
                 if(res.data.length){
                     Toast.info("登录成功!",1);
                     this.span.innerHTML=res.data[0].name;
                     sessionStorage.name=res.data[0].name;
                 }else{Toast.info("用户名不存在或密码错误",1);}
                 }) 
        },
        'login-password',
        null,
        ['请输入手机号', '请输入密码'],
    )
    goLogin=()=>{
        if(!sessionStorage.name){
            this.show();
        }else{this.showAlert()}
    }

    gotoRegister = () =>{
        const {history} = this.props;
        history.push("/register")
    }
    cancel=()=>{
        if(sessionStorage.name){this.showAlert()}
        else{Toast.info("您还没登录",1);}
        
        // sessionStorage.name="";
        // this.span.innerHTML="登录"
    }
    render(){
        return (
            <div id="mine">
                {/* <Head title="个人中心" show={true}  /> */}
                <NavBar
                        mode="dark"
                        style={{backgroundColor:"red"}}
                        icon={<Icon type="left" />}
                        leftContent={"注册"}
                        onLeftClick={this.gotoRegister}
                        >{"个人中心"}</NavBar>
                <div className="mine_head" style={{marginTop:45}}>
                    <img className="mine_head_bg" src={loginImg1} alt=""/>
                    <h3 className="mine_head_hd">
                        <img  src={loginImg2} alt=""/>
                        <span id="name1" ref={el=>this.span=el} onClick={this.goLogin}>{sessionStorage.name?sessionStorage.name:"登录"}</span>
                    </h3>                
                </div>
                <div className="myicon">
                    <a href="">
                        <i className="icon iconfont icon-daifukuan"></i>
                        <span>待付款</span>
                    </a>
                    <a href="">
                        <i className="icon iconfont icon-daifahuo1"></i>
                        <span>待发货</span>
                    </a>
                    <a href="">
                        <i className="icon iconfont icon-daishouhuo"></i>
                        <span>待收货</span>
                    </a>
                    <a href="">
                        <i className="icon iconfont icon-daipingjia"></i>
                        <span>待评价</span>
                    </a>
                 </div>
       <List renderHeader={() => '个人中心'}>
        <Item
          thumb="http://wanghg.top/images/p1.png"
          arrow="horizontal" onClick={() => {}}>我的收藏</Item>
        <Item
          thumb="http://wanghg.top/images/p2.png"
          onClick={() => {}}  arrow="horizontal">地址管理</Item>
          <Item
          thumb="http://wanghg.top/images/p3.png"
          arrow="horizontal" onClick={() => {}}>我的优惠劵</Item>
        <Item
          thumb="http://wanghg.top/images/p4.png"
          onClick={() => {}}  arrow="horizontal">我的商城币</Item>
        <Item
          thumb="http://wanghg.top/images/p5.png"
          onClick={this.cancel}  arrow="horizontal">退出登录</Item>
      </List>
                 {/* <WingBlank> */}
                    {/* <WhiteSpace size="lg"  />
                    <Button type="primary" onClick={showAlert} >弹框</Button>
                    <WhiteSpace size="lg"  />
                    <Button type="warning" onClick={show} >登录</Button>
                    <WhiteSpace size="lg"  />
                    <Button type="ghost" onClick={this.showActionSheet} >列表</Button>
                    <WhiteSpace size="lg"  />
                    <Button type="primary" onClick={this.gotoLogin} >注册</Button> */}
                {/* </WingBlank> */}
                
            </div>
        )
    }
}

//WingBlank 左右留白 <WingBlank><p></p></WingBlank>
//WhiteSpace 上下留白 <WhiteSpace size="lg"></WhiteSpace>或者<WhiteSpace size="lg" />