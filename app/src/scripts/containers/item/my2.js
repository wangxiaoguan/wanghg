






import React,{Component} from "react";



import axios from "axios";


import "./index.scss";

import {Button,List,  Modal,NavBar,Icon,Toast,TextareaItem  } from 'antd-mobile';

const alert = Modal.alert;
const prompt = Modal.prompt;






export class My2 extends Component{

    goback=()=>{ const {history} = this.props;history.goBack();}
    add=()=>{}
   
    render(){
        return (
            <div id="my2"  className="common" style={{marginTop:45}}>
                <NavBar
                        mode="dark"
                        style={{backgroundColor:"red"}}
                        icon={<Icon type="left" />}
                        leftContent={"返回"}
                        onLeftClick={this.goback}
                >{"地址管理"}</NavBar>
                <Button size="small" inline onClick={this.add} >+新增</Button>
                <h1>待开发中...</h1>
                
            </div>
        )
    }
}

//WingBlank 左右留白 <WingBlank><p></p></WingBlank>
//WhiteSpace 上下留白 <WhiteSpace size="lg"></WhiteSpace>或者<WhiteSpace size="lg" />