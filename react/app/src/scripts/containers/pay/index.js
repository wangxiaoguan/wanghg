






import React,{Component} from "react";



import axios from "axios";


import "./index.scss";

import img from "./zfb.jpg"

import { WingBlank, WhiteSpace ,Button,  Modal,ActionSheet,NavBar,Icon,Toast  } from 'antd-mobile';

const alert = Modal.alert;
const prompt = Modal.prompt;






export class Pay extends Component{

    goback=()=>{ const {history} = this.props;history.goBack();}

    render(){
        const {history,location} = this.props;
        return (
            <div id="pay" style={{marginTop:45}}>
                <NavBar
                        mode="dark"
                        style={{backgroundColor:"red"}}
                        icon={<Icon type="left" />}
                        leftContent={"返回"}
                        onLeftClick={this.goback}
                >{"支付"}</NavBar>
                
                <h1 onClick={this.goSee}>请支付{location.search.split("=")[1]}元</h1>
                <h2>
                    <img src={img} alt=""/>
                </h2>
                
            </div>
        )
    }
}

//WingBlank 左右留白 <WingBlank><p></p></WingBlank>
//WhiteSpace 上下留白 <WhiteSpace size="lg"></WhiteSpace>或者<WhiteSpace size="lg" />